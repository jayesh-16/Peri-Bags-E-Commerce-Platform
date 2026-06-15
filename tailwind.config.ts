import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-inter)', 'sans-serif'],
  			serif: ['var(--font-playfair)', 'serif'],
            "display-hero-mobile": ["var(--font-playfair)", 'serif'],
            "display-hero": ["var(--font-playfair)", 'serif'],
            "caption": ["var(--font-inter)", 'sans-serif'],
            "headline-h1": ["var(--font-playfair)", 'serif'],
            "label-price": ["var(--font-inter)", 'sans-serif'],
            "body-md": ["var(--font-inter)", 'sans-serif'],
            "headline-h3": ["var(--font-inter)", 'sans-serif'],
            "body-lg": ["var(--font-inter)", 'sans-serif'],
            "label-button": ["var(--font-inter)", 'sans-serif'],
            "headline-h2": ["var(--font-inter)", 'sans-serif'],
            "display": ["var(--font-playfair)", "serif"],
            "body": ["var(--font-inter)", "sans-serif"]
  		},
        fontSize: {
            "display-hero-mobile": ["56px", { "lineHeight": "1.2", "fontWeight": "700" }],
            "display-hero": ["80px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700" }],
            "caption": ["14px", { "lineHeight": "1.4", "fontWeight": "400" }],
            "headline-h1": ["36px", { "lineHeight": "1.3", "fontWeight": "600" }],
            "label-price": ["18px", { "lineHeight": "1.2", "fontWeight": "700" }],
            "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
            "headline-h3": ["24px", { "lineHeight": "1.4", "fontWeight": "600" }],
            "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
            "label-button": ["14px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "500" }],
            "headline-h2": ["30px", { "lineHeight": "1.4", "fontWeight": "600" }]
        },
        spacing: {
            "hero-vertical": "8rem",
            "card-padding": "1.5rem",
            "section-inner": "3rem",
            "base": "4px",
            "component-padding": "1rem",
            "section-block": "8rem"
        },
  		colors: {
            "on-secondary": "#ffffff",
            "error": "#ba1a1a",
            "tertiary-fixed": "#e6e2de",
            "surface": "#f9f9f7",
            "surface-container-lowest": "#ffffff",
            "tertiary-container": "#2d2c2a",
            "on-error-container": "#93000a",
            "primary": "#171818",
            "on-surface-variant": "#444748",
            "surface-container-highest": "#e2e3e1",
            "inverse-surface": "#2f3130",
            "inverse-primary": "#c8c6c5",
            "surface-container": "#eeeeec",
            "background": "#f9f9f7",
            "muted-foreground": "#6B6B6B",
            "secondary": "#C8956C",
            "error-container": "#ffdad6",
            "destructive": "#DC2626",
            "on-primary-fixed": "#1b1c1c",
            "surface-container-high": "#e8e8e6",
            "surface-variant": "#e2e3e1",
            "on-tertiary": "#ffffff",
            "tertiary-fixed-dim": "#c9c6c3",
            "surface-bright": "#f9f9f7",
            "surface-container-low": "#f4f4f2",
            "on-secondary-fixed": "#2e1500",
            "border": "#E2DDD6",
            "tertiary": "#181816",
            "on-secondary-fixed-variant": "#643e1c",
            "on-tertiary-fixed-variant": "#484644",
            "on-error": "#ffffff",
            "on-background": "#1a1c1b",
            "on-surface": "#1a1c1b",
            "foreground": "#1A1A1A",
            "primary-fixed-dim": "#c8c6c5",
            "on-primary-container": "#949393",
            "secondary-fixed-dim": "#f3bb90",
            "success": "#16A34A",
            "outline-variant": "#c4c7c7",
            "outline": "#747878",
            "secondary-fixed": "#ffdcc2",
            "secondary-container": "#ffc69a",
            "primary-fixed": "#e4e2e1",
            "surface-tint": "#5f5e5e",
            "inverse-on-surface": "#f1f1ef",
            "on-secondary-container": "#7a512d",
            "on-tertiary-fixed": "#1c1b1a",
            "on-tertiary-container": "#969390",
            "muted": "#F4F1EC",
            "surface-dim": "#dadad8",
            "primary-container": "#2c2c2c",
            "on-primary": "#ffffff",
            "on-primary-fixed-variant": "#474747",
            // Keep Shadcn format for components that might rely on them
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))'
			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))'
			},
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
            "fade-up": {
                "0%": { opacity: "0", transform: "translateY(20px)" },
                "100%": { opacity: "1", transform: "translateY(0)" }
            },
            "slow-fade-up": {
                "0%": { opacity: "0", transform: "translateY(40px)" },
                "100%": { opacity: "1", transform: "translateY(0)" }
            },
            "magnetic-pulse": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.02)" }
            }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
            "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            "slow-fade-up": "slow-fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            "magnetic-pulse": "magnetic-pulse 2s infinite ease-in-out"
  		}
  	}
  },
  plugins: [
      require("@tailwindcss/container-queries"),
  ],
};
export default config;
