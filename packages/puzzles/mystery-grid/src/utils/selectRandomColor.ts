import { sample } from "lodash";
import { IValidGridColor } from "../types";

export const selectRandomColor = (): IValidGridColor => sample(["red", "green", "yellow", "purple"]) ?? "red";
