/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, MountingOptions } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import { RouteLocation } from 'vue-router';

import EmployeeDetails from '../../../../../../main/webapp/app/entities/employee/employee-details.vue';
import EmployeeService from '../../../../../../main/webapp/app/entities/employee/employee.service';
import AlertService from '../../../../../../main/webapp/app/shared/alert/alert.service';

type EmployeeDetailsComponentType = InstanceType<typeof EmployeeDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const employeeSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('Employee Management Detail Component', () => {
    let employeeServiceStub: SinonStubbedInstance<EmployeeService>;
    let mountOptions: MountingOptions<EmployeeDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      employeeServiceStub = sinon.createStubInstance<EmployeeService>(EmployeeService);

      alertService = new AlertService({
        i18n: { t: vitest.fn() } as any,
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          'font-awesome-icon': true,
          'router-link': true,
        },
        provide: {
          alertService,
          employeeService: () => employeeServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        employeeServiceStub.find.resolves(employeeSample);
        route = {
          params: {
            employeeId: '' + 123,
          },
        };
        const wrapper = shallowMount(EmployeeDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.employee).toMatchObject(employeeSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        employeeServiceStub.find.resolves(employeeSample);
        const wrapper = shallowMount(EmployeeDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
