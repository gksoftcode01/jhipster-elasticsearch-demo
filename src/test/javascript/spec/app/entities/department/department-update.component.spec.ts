/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, MountingOptions } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import { RouteLocation } from 'vue-router';

import DepartmentUpdate from '../../../../../../main/webapp/app/entities/department/department-update.vue';
import DepartmentService from '../../../../../../main/webapp/app/entities/department/department.service';
import AlertService from '../../../../../../main/webapp/app/shared/alert/alert.service';

import LocationService from '../../../../../../main/webapp/app/entities/location/location.service';

type DepartmentUpdateComponentType = InstanceType<typeof DepartmentUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const departmentSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<DepartmentUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('Department Management Update Component', () => {
    let comp: DepartmentUpdateComponentType;
    let departmentServiceStub: SinonStubbedInstance<DepartmentService>;

    beforeEach(() => {
      route = {};
      departmentServiceStub = sinon.createStubInstance<DepartmentService>(DepartmentService);

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
          departmentService: () => departmentServiceStub,
          locationService: () =>
            sinon.createStubInstance<LocationService>(LocationService, {
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
        const wrapper = shallowMount(DepartmentUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.department = departmentSample;
        departmentServiceStub.update.resolves(departmentSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(departmentServiceStub.update.calledWith(departmentSample)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        departmentServiceStub.create.resolves(entity);
        const wrapper = shallowMount(DepartmentUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.department = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(departmentServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        departmentServiceStub.find.resolves(departmentSample);
        departmentServiceStub.retrieve.resolves([departmentSample]);

        // WHEN
        route = {
          params: {
            departmentId: '' + departmentSample.id,
          },
        };
        const wrapper = shallowMount(DepartmentUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.department).toMatchObject(departmentSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        departmentServiceStub.find.resolves(departmentSample);
        const wrapper = shallowMount(DepartmentUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
