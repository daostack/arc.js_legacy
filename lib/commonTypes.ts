export type fnVoid = () => void;
export type Hash = string;
export type Address = string;

export interface VoteConfig {
  /**
   * optional address of agent casting the vote.
   */
  onBehalfOf?: string;
  /**
   * unique hash of proposal index in the scope of the scheme
   */
  proposalId: string;
  /**
   * the choice of vote. Can be 1 (YES) or 2 (NO).
   */
  vote: number;
}

export enum BinaryVoteResult {
  None = 0,
  Yes = 1,
  No = 2,
}

export interface GetDaoProposalsConfig {
  /**
   * The avatar under which the proposals were created
   */
  avatar: Address;
  /**
   * Optionally filter on the given proposalId
   */
  proposalId?: Hash;
}
