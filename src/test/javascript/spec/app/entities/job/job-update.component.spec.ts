/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, MountingOptions } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import { RouteLocation } from 'vue-router';

import JobUpdate from '../../../../../../main/webapp/app/entities/job/job-update.vue';
import JobService from '../../../../../../main/webapp/app/entities/job/job.service';
import AlertService from '../../../../../../main/webapp/app/shared/alert/alert.service';

import TaskService from '../../../../../../main/webapp/app/entities/task/task.service';
import EmployeeService from '../../../../../../main/webapp/app/entities/employee/employee.service';

type JobUpdateComponentType = InstanceType<typeof JobUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const jobSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<JobUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('Job Management Update Component', () => {
    let comp: JobUpdateComponentType;
    let jobServiceStub: SinonStubbedInstance<JobService>;

    beforeEach(() => {
      route = {};
      jobServiceStub = sinon.createStubInstance<JobService>(JobService);

      alertService = new AlertService({
        i18n: { t: vitest.fn() } as any,
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          'font-awesome-icon': true,
          'b-input-group': true,
          'b-input-group-prepend': true,
          'b-form-datepicker': true,
          'b-form-input': true,
        },
        provide: {
          alertService,
          jobService: () => jobServiceStub,
          taskService: () =>
            sinon.createStubInstance<TaskService>(TaskService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
          employeeService: () =>
            sinon.createStubInstance<EmployeeService>(EmployeeService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
        },
      };
    });

    afterEach(() => {
      vitest.resetAllMocks();
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const wrapper = shallowMount(JobUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.job = jobSample;
        jobServiceStub.update.resolves(jobSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(jobServiceStub.update.calledWith(jobSample)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        jobServiceStub.create.resolves(entity);
        const wrapper = shallowMount(JobUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.job = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(jobServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        jobServiceStub.find.resolves(jobSample);
        jobServiceStub.retrieve.resolves([jobSample]);

        // WHEN
        route = {
          params: {
            jobId: '' + jobSample.id,
          },
        };
        const wrapper = shallowMount(JobUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.job).toMatchObject(jobSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        jobServiceStub.find.resolves(jobSample);
        const wrapper = shallowMount(JobUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
