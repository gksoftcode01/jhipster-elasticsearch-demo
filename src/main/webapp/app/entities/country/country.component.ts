import { defineComponent, inject, onMounted, ref, Ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import { ICountry } from '@/shared/model/country.model';
import CountryService from './country.service';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Country',
  setup() {
    const { t: t$ } = useI18n();
    const countryService = inject('countryService', () => new CountryService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const currentSearch = ref('');

    const countries: Ref<ICountry[]> = ref([]);

    const isFetching = ref(false);

    const clear = () => {
      currentSearch.value = '';
    };

    const retrieveCountrys = async () => {
      isFetching.value = true;
      try {
        const res = currentSearch.value ? await countryService().search(currentSearch.value) : await countryService().retrieve();
        countries.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveCountrys();
    };

    onMounted(async () => {
      await retrieveCountrys();
    });

    const search = query => {
      if (!query) {
        return clear();
      }
      currentSearch.value = query;
      retrieveCountrys();
    };

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: ICountry) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeCountry = async () => {
      try {
        await countryService().delete(removeId.value);
        const message = t$('elasticdemoApp.country.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveCountrys();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      countries,
      handleSyncList,
      isFetching,
      retrieveCountrys,
      clear,
      currentSearch,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeCountry,
      t$,
    };
  },
});
