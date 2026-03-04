/**
 * Account Service Layer
 *
 * Abstracts account/user data access for easy backend swap.
 * Currently uses mock data from shared/data/users.ts.
 * TODO: Replace with ClaimLink backend API when ready.
 */

export interface UserProfile {
  id: string;
  principalId: string;
  username?: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface AccountStats {
  certificatesMinted: number;
  nftsMinted: number;
  collectionsCreated: number;
  campaignsCreated: number;
}

export class AccountService {
  /**
   * Get current user profile
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async getProfile(principalId: string): Promise<UserProfile> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_profile(principalId);

    // Mock implementation
    return Promise.resolve({
      id: `user-${principalId}`,
      principalId,
      username: 'demo_user',
      email: 'demo@example.com',
      displayName: 'Demo User',
      avatarUrl: undefined,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    principalId: string,
    request: UpdateProfileRequest
  ): Promise<UserProfile> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.update_profile(principalId, request);

    // Mock implementation
    const currentProfile = await this.getProfile(principalId);
    return Promise.resolve({
      ...currentProfile,
      ...request,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Get account statistics
   */
  static async getAccountStats(_principalId: string): Promise<AccountStats> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_account_stats(principalId);

    // Mock implementation
    return Promise.resolve({
      certificatesMinted: 12,
      nftsMinted: 45,
      collectionsCreated: 3,
      campaignsCreated: 5,
    });
  }

  /**
   * Get account activity history
   */
  static async getActivityHistory(_principalId: string): Promise<
    Array<{
      id: string;
      type: 'mint' | 'transfer' | 'collection' | 'campaign';
      description: string;
      timestamp: string;
    }>
  > {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_activity_history(principalId);

    // Mock implementation
    return Promise.resolve([
      {
        id: '1',
        type: 'mint',
        description: 'Minted certificate "The midsummer Night Dream"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: '2',
        type: 'collection',
        description: 'Created collection "Digital Art Collection"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: '3',
        type: 'campaign',
        description: 'Launched campaign "Summer NFT Drop"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
    ]);
  }

  /**
   * Delete account
   */
  static async deleteAccount(_principalId: string): Promise<void> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.delete_account(principalId);

    // Mock implementation
    return Promise.resolve();
  }
}
