import { BigNumber } from "bignumber.js";
import { Address, Hash } from "./commonTypes";
import {
  EntityFetcherFactory,
  EventFetcherFactory,
  TransformEventCallback,
  Web3EventService
} from "./web3EventService";
import {
  IntVoteInterfaceWrapper,
} from "./wrappers/intVoteInterface";

import { DecodedLogEntryEvent } from "web3";
import {
  ExecuteProposalEventResult,
  NewProposalEventResult
} from "./wrappers/iIntVoteInterface";
/**
 * A single instance of ProposalService provides services relating to a single
 * type of proposal (TProposal), for example a proposal to contribute rewards to a beneficiary.
 * When constructing a ProposalService we pass to the constructor a `ProposalMaker<TProposal, TEventArgs>`
 * that provides functions enabling ProposalService to do its job with respect to the given TProposal.
 * Note it is not scoped to a particular Avatar.
 *
 * For more information, see [Proposals](Proposals#proposals).
 */
export class ProposalService {

  constructor(private web3EventService: Web3EventService) {

  }

  /**
   * Returns an EntityFetcherFactory for fetching proposal-related events.  Can take any EventFetcherFactory
   * whose event args supply `_proposalId`.  Returns events as a promise of `TProposal`.  You must supply an
   * `EventFetcherFactory` for fetching the events and a callback to transform `TEventArgs` to a promise of `TProposal`.
   * Each entity, when the associated proposal is votable and options.votingMachine is supplied,
   * will also contain a `votingMachine` property of type `IntVoteInterfaceWrapper`.
   * @type TEventArgs The type of the `args` object in the event.
   * @type TProposal The type of object returned as a transformation of the `args` information in each event.
   * @param options
   */
  public getProposalEvents<TProposal, TEventArgs extends EventHasPropertyId = EventHasPropertyId>(
    options: GetProposalEventsOptions<TProposal, TEventArgs>)
    : EntityFetcherFactory<TProposal | (TProposal & ProposalEntity), TEventArgs> {

    if (!options.transformEventCallback) {
      throw new Error("transformEventCallback must be supplied");
    }

    if (!options.proposalsEventFetcher) {
      throw new Error("proposalsEventFetcher must be supplied");
    }

    const votableOnly = !!options.votableOnly;

    if (votableOnly && !options.votingMachine) {
      throw new Error("votingMachine must be supplied when votableOnly is true");
    }

    return this.web3EventService.createEntityFetcherFactory<TProposal, TEventArgs>(
      options.proposalsEventFetcher,
      async (event: DecodedLogEntryEvent<TEventArgs>)
        : Promise<TProposal | (TProposal & ProposalEntity) | undefined> => {
        let entity: TProposal | (TProposal & ProposalEntity) | undefined;

        if (options.votingMachine) {
          const isVotable = await options.votingMachine.isVotable({ proposalId: event.args._proposalId });

          entity = await (
            ((!votableOnly || isVotable) ?
              options.transformEventCallback(event) :
              Promise.resolve(undefined)));

          if (entity && isVotable) {
            (entity as (TProposal & ProposalEntity)).votingMachine = options.votingMachine;
          }
        } else {
          entity = await options.transformEventCallback(event);
        }
        return entity;
      },
      options.baseArgFilter);
  }

  /**
   * Returns promise of an EntityFetcherFactory for fetching votable proposals from the
   * given `IntVoteInterfaceWrapper`. The proposals are returned as promises of instances
   * of `VotableProposal`.
   *
   * @param votingMachineAddress
   */
  public getVotableProposals(votingMachine: IntVoteInterfaceWrapper):
    EntityFetcherFactory<VotableProposal, NewProposalEventResult> {

    return this.web3EventService.createEntityFetcherFactory<VotableProposal, NewProposalEventResult>(
      votingMachine.VotableProposals,
      (event: DecodedLogEntryEvent<NewProposalEventResult>): Promise<VotableProposal> => {
        return Promise.resolve(
          {
            avatarAddress: event.args._avatar,
            numOfChoices: event.args._numOfChoices.toNumber(),
            paramsHash: event.args._paramsHash,
            proposalId: event.args._proposalId,
            proposerAddress: event.args._proposer,
          }
        );
      });
  }

  /**
   * Returns promise of an EntityFetcherFactory for fetching executed proposals from the
   * given `IntVoteInterfaceWrapper`.
   * The proposals are returned as promises of instances of `ExecutedProposal`.
   *
   * @param votingMachineAddress
   */
  public getExecutedProposals(votingMachine: IntVoteInterfaceWrapper):
    EntityFetcherFactory<ExecutedProposal, ExecuteProposalEventResult> {

    return this.web3EventService.createEntityFetcherFactory<ExecutedProposal, ExecuteProposalEventResult>(
      votingMachine.ExecuteProposal,
      (event: DecodedLogEntryEvent<ExecuteProposalEventResult>): Promise<ExecutedProposal> => {
        return Promise.resolve(
          {
            decision: event.args._decision.toNumber(),
            proposalId: event.args._proposalId,
            totalReputation: event.args._totalReputation,
          }
        );
      });
  }
}

export interface EventHasPropertyId {
  _proposalId: Hash;
}

export interface VotableProposal {
  numOfChoices: number;
  paramsHash: Hash;
  proposalId: Hash;
  proposerAddress: Address;
  avatarAddress: Address;
}

// TODO: include avatar address?
export interface ExecutedProposal {
  /**
   * the vote choice that won.
   */
  decision: number;
  /**
   * The id of the proposal that was executed.
   */
  proposalId: Hash;
  /**
   * The total reputation in the DAO at the time the proposal was executed
   */
  totalReputation: BigNumber;
}

export interface GetProposalEventsOptions<TProposal, TEventArgs extends EventHasPropertyId = EventHasPropertyId> {
  /**
   * Event fetcher to use to get or watch the event that supplies `TEventArgs`.
   */
  proposalsEventFetcher: EventFetcherFactory<TEventArgs>;
  /**
   * Returns Promise of `TProposal` given `TEventArgs` for the event.  Return of `undefined` will be ignored, not
   * passed-on to the caller.
   */
  transformEventCallback: TransformEventCallback<TProposal, TEventArgs>;
  /**
   * Optional to filter events on the given filter, like `{ _avatar: [anAddress] }`.
   * This will be merged with any filter that the caller provides when creating the EntityFetcher.
   */
  baseArgFilter?: any;
  /**
   * True to only return votable proposals.  Default is false.
   */
  votableOnly?: boolean;
  /**
   * Used to determine whether proposals are votable.
   * This is only required when votableOnly is set to `true`.
   */
  votingMachine?: IntVoteInterfaceWrapper;
}

export interface ProposalEntity {
  votingMachine: IntVoteInterfaceWrapper;
}
