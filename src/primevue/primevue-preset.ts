import Aura from '@primevue/themes/aura';
import { definePreset, palette } from '@primevue/themes';
import { fieldset } from './components/fieldset.ts';
import { divider } from './components/divider.ts';

export const primevuePreset = definePreset(Aura, {
    semantic: {
        colorScheme: {
            light: {
                primary: palette('darkred')
            }
        }
    },
    components: {
        divider,
        fieldset
    }
});
