import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Legacy colors for compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				
				// Chat Widget Builder specific colors
				'cwb': {
					background: 'hsl(var(--cwb-background))',
					foreground: 'hsl(var(--cwb-foreground))',
					card: 'hsl(var(--cwb-card))',
					'card-foreground': 'hsl(var(--cwb-card-foreground))',
					primary: 'hsl(var(--cwb-primary))',
					'primary-foreground': 'hsl(var(--cwb-primary-foreground))',
					'primary-dark': 'hsl(var(--cwb-primary-dark))',
					'primary-light': 'hsl(var(--cwb-primary-light))',
					secondary: 'hsl(var(--cwb-secondary))',
					'secondary-foreground': 'hsl(var(--cwb-secondary-foreground))',
					muted: 'hsl(var(--cwb-muted))',
					'muted-foreground': 'hsl(var(--cwb-muted-foreground))',
					border: 'hsl(var(--cwb-border))',
					input: 'hsl(var(--cwb-input))',
					'input-border': 'hsl(var(--cwb-input-border))',
					ring: 'hsl(var(--cwb-ring))',
					success: 'hsl(var(--cwb-success))',
					'success-foreground': 'hsl(var(--cwb-success-foreground))',
					destructive: 'hsl(var(--cwb-destructive))',
					'destructive-foreground': 'hsl(var(--cwb-destructive-foreground))',
					'chat-primary': 'hsl(var(--cwb-chat-primary))',
					'chat-background': 'hsl(var(--cwb-chat-background))',
					'chat-message-bg': 'hsl(var(--cwb-chat-message-bg))',
					'chat-user-message': 'hsl(var(--cwb-chat-user-message))',
					'chat-shadow': 'hsl(var(--cwb-chat-shadow))',
					'step-active': 'hsl(var(--cwb-step-active))',
					'step-completed': 'hsl(var(--cwb-step-completed))',
					'step-pending': 'hsl(var(--cwb-step-pending))',
					'step-background': 'hsl(var(--cwb-step-background))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
