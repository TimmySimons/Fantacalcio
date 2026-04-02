import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import { fieldset } from './components/fieldset.ts';
import { divider } from './components/divider.ts';

export const primevuePreset = definePreset(Aura, {
    primitive: {
        red: {
            50: '#F5EFE6',
            100: '#E6D3CC',
            200: '#C9A1A1',
            300: '#A45A5A',
            400: '#8B0000', // Dark Red
            500: '#7A0000',
            600: '#5A0F14',
            700: '#4A0C10',
            800: '#2E2E2E',
            900: '#1F1F1F'
        },
        gray: {
            50: '#F7F7F7',
            100: '#EEEEEE',
            200: '#D5D5D5', // anchor
            300: '#BEBEBE',
            400: '#9E9E9E',
            500: '#7E7E7E',
            600: '#5F5F5F',
            700: '#424242',
            800: '#2E2E2E',
            900: '#1C1C1C'
        }
    },
    semantic: {
        colorScheme: {
            light: {
                primary: {
                    color: '{red.400}',
                    50: '{red.50}',
                    100: '{red.100}',
                    200: '{red.200}',
                    300: '{red.300}',
                    400: '{red.400}',
                    500: '{red.500}',
                    600: '{red.600}',
                    700: '{red.700}',
                    800: '{red.800}',
                    900: '{red.900}',
                    hover: { color: '{red.500}' },
                    active: { color: '{red.500}' }
                }
            },
            dark: {}
        }
    },
    components: {
        divider,
        fieldset
    }
});
