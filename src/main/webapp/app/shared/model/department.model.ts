import { ILocation } from '@/shared/model/location.model';
import { IEmployee } from '@/shared/model/employee.model';
import { IJobHistory } from '@/shared/model/job-history.model';

export interface IDepartment {
  id?: number;
  departmentName?: string;
  location?: ILocation | null;
  employees?: IEmployee[] | null;
  jobHistory?: IJobHistory | null;
}

export class Department implements IDepartment {
  constructor(
    public id?: number,
    public departmentName?: string,
    public location?: ILocation | null,
    public employees?: IEmployee[] | null,
    public jobHistory?: IJobHistory | null
  ) {}
}
