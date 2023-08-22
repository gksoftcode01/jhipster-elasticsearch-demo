import { defineComponent, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { email, maxLength, minLength, required } from '@vuelidate/validators';
import axios from 'axios';

const validations = {
  resetAccount: {
    email: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(254),
      email,
    },
  },
};

interface ResetAccount {
  email: string | null;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ResetPasswordInit',
  validations,
  setup(prop) {
    const error: Ref<string> = ref(null);
    const success: Ref<boolean> = ref(false);
    const resetAccount: Ref<ResetAccount> = ref({
      email: null,
    });

    return {
      error,
      success,
      resetAccount,
      v$: useVuelidate(),
      t$: useI18n().t,
    };
  },
  methods: {
    async requestReset(): Promise<void> {
      this.error = null;
      this.success = false;
      await axios
        .post('api/account/reset-password/init', this.resetAccount.email, {
          headers: {
            'content-type': 'text/plain',
          },
        })
        .then(() => {
          this.success = true;
        })
        .catch(() => {
          this.success = false;
          this.error = 'ERROR';
        });
    },
  },
});
