import { authClient } from "@/lib/auth-client";

export interface PremiumCheckResult {
  isPremium: boolean;
  isAuthenticated: boolean;
  reason?: string;
}

/**
 * Check if a user has premium/active subscription with valid session
 * Use this to protect premium features and routes
 */
export const checkPremiumAccess = async (): Promise<PremiumCheckResult> => {
  try {
    // Check if user has valid session
    const { data: session } = await authClient.getSession();

    if (!session || !session.user) {
      return {
        isPremium: false,
        isAuthenticated: false,
        reason: "No active session",
      };
    }

    // Check if user has active subscription
    const { data: subscriptionState } = await authClient.customer.state();

    if (!subscriptionState) {
      return {
        isPremium: false,
        isAuthenticated: true,
        reason: "No subscription found",
      };
    }

    // Check if subscription is active
    // CustomerState has activeSubscriptions array
    let isPremium = false;

    if (
      subscriptionState.activeSubscriptions &&
      Array.isArray(subscriptionState.activeSubscriptions)
    ) {
      isPremium = subscriptionState.activeSubscriptions.length > 0;
    }

    return {
      isPremium,
      isAuthenticated: true,
      reason: !isPremium ? "Subscription inactive or expired" : undefined,
    };
  } catch (error) {
    console.error("Premium check error:", error);
    return {
      isPremium: false,
      isAuthenticated: false,
      reason: "Error checking premium status",
    };
  }
};

/**
 * Protect a feature behind premium wall
 * Returns true if user can access premium feature
 */
export const isPremiumFeatureAccessible = async (): Promise<boolean> => {
  const result = await checkPremiumAccess();
  return result.isPremium;
};

/**
 * Get user subscription status for display
 */
export const getUserSubscriptionStatus = async () => {
  try {
    const { data: subscriptionState } = await authClient.customer.state();
    return subscriptionState;
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return null;
  }
};
