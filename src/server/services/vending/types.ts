import { IProduct } from "../../models/Product";

export enum VendingEvents {
  SelectItem = "selectItem",
  Deposit = "deposit",
  Payout = "payout",
}

// The events that the machine handles
export type VendingEvent =
  | { type: VendingEvents.SelectItem; item: IProduct; quantity: number }
  | { type: VendingEvents.Deposit; value: number }
  | { type: VendingEvents.Payout };

export enum VendingMachineStates {
  UpdateBalance = "updateBalance",
  Idle = "idle",
  Vending = "vending",
}

type SelectedProduct = {
  item?: IProduct;
  quantity?: number;
};

// Tray holds info about last purchage
type Tray = SelectedProduct & {
  total?: number;
  change: number;
};

// The context (extended state) of the machine
export interface VendingContext {
  deposited: number;
  userId: string;
  selected: SelectedProduct;
  tray: Tray;
  userBalance?: number;
  userRef?: any;
}

export type VendingTypestate =
  | {
      value: VendingMachineStates.UpdateBalance;
      context: VendingContext;
    }
  | {
      value: VendingMachineStates.Idle;
      context: VendingContext;
    }
  | {
      value: VendingMachineStates.Vending;
      context: VendingContext;
    };
