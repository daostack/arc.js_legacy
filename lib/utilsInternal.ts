import { fnVoid } from "./commonTypes";

/**
 * Utils not meant to be exported to the public
 */
export class UtilsInternal {

  public static sleep(milliseconds: number): Promise<any> {
    return new Promise((resolve: fnVoid): any => setTimeout(resolve, milliseconds));
  }
}
