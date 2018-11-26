import { Address, DefaultSchemePermissions, SchemePermissions } from "./commonTypes";
import { ContractWrapperBase } from "./contractWrapperBase";
import { ControllerService } from "./controllerService";
import { ISchemeWrapper } from "./iContractWrapperBase";

/**
 * Abstract base class for all Arc scheme contract wrapper classes. A scheme is defined as an Arc
 * contract that can be registered with and can thus interact with a DAO controller.
 */
export abstract class SchemeWrapperBase extends ContractWrapperBase implements ISchemeWrapper {
  /**
   * Minimum permissions required by the scheme
   */
  public getDefaultPermissions(): SchemePermissions {
    return DefaultSchemePermissions.MinimumPermissions as number;
  }

  /**
   * Returns the scheme permissions.
   * @param avatarAddress
   */
  public getSchemePermissions(avatarAddress: Address): Promise<SchemePermissions> {
    return Promise.resolve(this.getDefaultPermissions());
  }

  /**
   * Returns this scheme's permissions.
   * @param avatarAddress
   */
  protected async _getSchemePermissions(avatarAddress: Address): Promise<SchemePermissions> {
    const controllerService = new ControllerService(avatarAddress);
    const controller = await controllerService.getController();
    const permissions = await controller.getSchemePermissions(this.address, avatarAddress) as string;

    return SchemePermissions.fromString(permissions);
  }
}
