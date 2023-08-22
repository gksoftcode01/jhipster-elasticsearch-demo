import { defineComponent, provide } from 'vue';

import UserService from '@/entities/user/user.service';
import DepartmentService from './department/department.service';
import JobHistoryService from './job-history/job-history.service';
import EmployeeService from './employee/employee.service';
import TaskService from './task/task.service';
import LocationService from './location/location.service';
import JobService from './job/job.service';
import CountryService from './country/country.service';
import RegionService from './region/region.service';
// jhipster-needle-add-entity-service-to-entities-component-import - JHipster will import entities services here

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Entities',
  setup() {
    provide('userService', () => new UserService());
    provide('departmentService', () => new DepartmentService());
    provide('jobHistoryService', () => new JobHistoryService());
    provide('employeeService', () => new EmployeeService());
    provide('taskService', () => new TaskService());
    provide('locationService', () => new LocationService());
    provide('jobService', () => new JobService());
    provide('countryService', () => new CountryService());
    provide('regionService', () => new RegionService());
    // jhipster-needle-add-entity-service-to-entities-component - JHipster will import entities services here
  },
});
