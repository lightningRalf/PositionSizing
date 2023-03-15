def calculate_rr(entry, tp, sl):
    return abs((tp - entry) / (entry - sl))

def kelly_criterion(win_probability, reward_risk_ratio):
    return win_probability - ((1 - win_probability) / reward_risk_ratio)

def main():
    trading_stack = float(input("Enter your trading stack: "))

    trades = []
    while True:
        entry = float(input("\nEnter entry price: "))
        tp = float(input("Enter take profit (TP) price: "))
        sl = float(input("Enter stop loss (SL) price: "))
        win_probability = float(input("Enter win probability (as a decimal, e.g., 0.5 for 50%): "))

        rr = calculate_rr(entry, tp, sl)
        trades.append((entry, tp, sl, rr, win_probability))

        another_trade = input("Do you want to input another trade? (y/n): ")
        if another_trade.lower() != 'y':
            break

    kelly_values = [kelly_criterion(win_probability, rr) for entry, tp, sl, rr, win_probability in trades]
    
    if len(trades) == 1:
        adjusted_trading_sizes = [kelly_values[0] * trading_stack]
    else:
        total_kelly_value = sum(kelly_values)
        adjusted_trading_sizes = [kv * trading_stack / total_kelly_value for kv in kelly_values]

    for i, (entry, tp, sl, rr, win_probability) in enumerate(trades, start=1):
        print(f"\nTrade {i}:")
        print(f"Risk-Reward Ratio: {rr:.2f}")
        print(f"Win Probability: {win_probability * 100:.2f}%")
        print(f"Kelly Criteria: {kelly_values[i-1]:.2f}")
        print(f"Adjusted Trading Size: {adjusted_trading_sizes[i-1]:.2f}")

if __name__ == "__main__":
    main()
