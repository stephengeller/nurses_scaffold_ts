import * as fs from "fs";

export interface Nurse {
  uid: string;
  name: string;
}

export enum ShiftType {
  Morning = "morning",
  Evening = "evening",
  Night = "night",
}
interface BuildArgs {
  filename?: string;
  startDate: string;
  endDate: string;
}

export interface Shift {
  shiftType: ShiftType;
  nurses: Nurse[];
  date: Date;
}

export interface RosterBuilderArgs extends BuildArgs {
  nurses?: Nurse[];
}

export class RosterBuilder {
  private _nurses: Nurse[];
  private startDate: string;
  private endDate: string;
  private filename: string | undefined;

  constructor({ filename, startDate, endDate, nurses }: RosterBuilderArgs) {
    this._nurses = nurses || RosterBuilder.loadNurses(filename);
    this.filename = filename;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  get nurses(): Nurse[] {
    return this._nurses;
  }

  createShift(shiftType: ShiftType): {
    shiftType: ShiftType;
    nurses: Nurse[];
  } {
    const nurses = this._nurses.slice(0, 5);
    if (nurses.length < 5) {
      throw `Not enough nurses to fill shift (${nurses.length} nurses available)`;
    }

    this._nurses = this.nurses.slice(5, this.nurses.length);
    return { shiftType, nurses };
  }

  createDay(date: Date): Shift[] {
    return Object.values(ShiftType).map((shiftType) => {
      const shift = this.createShift(shiftType);
      return { ...shift, date };
    });
  }

  static loadNurses = (filename: string): Nurse[] => {
    const contents = fs.readFileSync(filename, "utf8");
    return JSON.parse(contents);
  };

  build = (): Shift[] => {
    // Get list of all nurses
    // Per day, get 5 nurses * 3 shifts
    // Output formatted
    throw "RosterBuilder#build Not Implemented";
  };
}
