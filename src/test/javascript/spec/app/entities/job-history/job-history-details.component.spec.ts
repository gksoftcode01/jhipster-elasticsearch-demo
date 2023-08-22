/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, MountingOptions } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import { RouteLocation } from 'vue-router';

import JobHistoryDetails from '../../../../../../main/webapp/app/entities/job-history/job-history-details.vue';
import JobHistoryService from '../../../../../../main/webapp/app/entities/job-history/job-history.service';
import AlertService from '../../../../../../main/webapp/app/shared/alert/alert.service';

type JobHistoryDetailsComponentType = InstanceType<typeof JobHistoryDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const jobHistorySample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('JobHistory Management Detail Component', () => {
    let jobHistoryServiceStub: SinonStubbedInstance<JobHistoryService>;
    let mountOptions: MountingOptions<JobHistoryDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      jobHistoryServiceStub = sinon.createStubInstance<JobHistoryService>(JobHistoryService);

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
          jobHistoryService: () => jobHistoryServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        jobHistoryServiceStub.find.resolves(jobHistorySample);
        route = {
          params: {
            jobHistoryId: '' + 123,
          },
        };
        const wrapper = shallowMount(JobHistoryDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.jobHistory).toMatchObject(jobHistorySample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        jobHistoryServiceStub.find.resolves(jobHistorySample);
        const wrapper = shallowMount(JobHistoryDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
