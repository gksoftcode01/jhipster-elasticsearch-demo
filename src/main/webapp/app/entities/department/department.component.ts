import { defineComponent, inject, onMounted, ref, Ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import { IDepartment } from '@/shared/model/department.model';
import DepartmentService from './department.service';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Department',
  setup() {
    const { t: t$ } = useI18n();
    const departmentService = inject('departmentService', () => new DepartmentService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const currentSearch = ref('');

    const departments: Ref<IDepartment[]> = ref([]);

    const isFetching = ref(false);

    const clear = () => {
      currentSearch.value = '';
    };

    const retrieveDepartments = async () => {
      isFetching.value = true;
      try {
        const res = currentSearch.value ? await departmentService().search(currentSearch.value) : await departmentService().retrieve();
        departments.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveDepartments();
    };

    onMounted(async () => {
      await retrieveDepartments();
    });

    const search = query => {
      if (!query) {
        return clear();
      }
      currentSearch.value = query;
      retrieveDepartments();
    };

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: IDepartment) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeDepartment = async () => {
      try {
        await departmentService().delete(removeId.value);
        const message = t$('elasticdemoApp.department.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveDepartments();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      departments,
      handleSyncList,
      isFetching,
      retrieveDepartments,
      clear,
      currentSearch,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeDepartment,
      t$,
    };
  },
});
