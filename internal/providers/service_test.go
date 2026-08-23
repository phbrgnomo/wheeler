package providers

import "testing"

func TestNormalizeProviderType(t *testing.T) {
	tests := map[string]string{
		"":               providerTypePolygon,
		" polygon ":      providerTypePolygon,
		"google":         providerTypeGoogle,
		"googlefinance":  providerTypeGoogle,
		"google_finance": providerTypeGoogle,
		"yahoo":          providerTypeYFinance,
		"yahoo_finance":  providerTypeYFinance,
		"YFINANCE":       providerTypeYFinance,
		"custom":         "custom",
	}
	for input, want := range tests {
		if got := normalizeProviderType(input); got != want {
			t.Errorf("normalizeProviderType(%q) = %q, want %q", input, got, want)
		}
	}
}
