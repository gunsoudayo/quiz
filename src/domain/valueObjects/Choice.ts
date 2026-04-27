export const CHOICE_VALUES = ["A", "B", "C", "D"] as const;

export type ChoiceValue = (typeof CHOICE_VALUES)[number];

export class Choice {
  private constructor(private readonly rawValue: ChoiceValue) {}

  static from(value: string): Choice {
    if (!Choice.isChoiceValue(value)) {
      throw new Error(`Invalid choice: ${value}`);
    }

    return new Choice(value);
  }

  static isChoiceValue(value: string): value is ChoiceValue {
    return CHOICE_VALUES.includes(value as ChoiceValue);
  }

  get value(): ChoiceValue {
    return this.rawValue;
  }

  equals(other: Choice): boolean {
    return this.rawValue === other.rawValue;
  }
}
