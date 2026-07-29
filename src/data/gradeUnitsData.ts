import { UnitData, GradeLevel } from '../types';
import { GRADE_1_UNITS } from './grade1Data';
import { UNITS_DATA as GRADE_2_UNITS } from './unitsData';
import { GRADE_3_UNITS } from './grade3Data';
import { GRADE_4_UNITS } from './grade4Data';
import { GRADE_5_UNITS } from './grade5Data';

export { GRADE_1_UNITS, GRADE_2_UNITS, GRADE_3_UNITS, GRADE_4_UNITS, GRADE_5_UNITS };

export const ALL_GRADE_UNITS: Record<GradeLevel, UnitData[]> = {
  1: GRADE_1_UNITS,
  2: GRADE_2_UNITS,
  3: GRADE_3_UNITS,
  4: GRADE_4_UNITS,
  5: GRADE_5_UNITS,
};
