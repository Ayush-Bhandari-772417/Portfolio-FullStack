// frontend2\tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: (theme) => ({
      DEFAULT: {
        css: {
          // Tighten figure → figcaption spacing
          figcaption: {
            marginTop: theme('spacing.1.5'),     // 0.375rem ≈ 6px
            marginBottom: '0',
            textAlign: 'left',                   // or 'center' — try both
            fontStyle: 'italic',
            color: theme('colors.slate.600'),
            fontSize: theme('fontSize.sm'),
          },

          // Reduce unwanted sibling margin inside figure (img + figcaption)
          'figure > * + *': {
            marginTop: theme('spacing.1.5'),
          },

          // For custom caption divs (table/equation) — keep tight
          '.table-caption, .figure-caption, .equation-caption': {
            marginTop: theme('spacing.1'),
            marginBottom: theme('spacing.3'),
            fontStyle: 'italic',
            color: theme('colors.slate.600'),
          },

          // Optional: reduce overall figure block spacing if still too much
          figure: {
            marginTop: theme('spacing.5'),
            marginBottom: theme('spacing.5'),
          },

          // Tables (helps if using real <caption> or custom div before table)
          caption: {
            marginBottom: theme('spacing.2'),
            textAlign: 'left',
            fontStyle: 'italic',
            color: theme('colors.slate.600'),
          },
        },
      },
      // If you're using prose-lg (you are)
      lg: {
        css: {
          figcaption: {
            marginTop: theme('spacing.2'),
          },
          figure: {
            marginTop: theme('spacing.6'),
            marginBottom: theme('spacing.6'),
          },
        },
      },
      }),
    },
  },

//   plugins: [
//     require('@tailwindcss/typography'),
//   ],
};