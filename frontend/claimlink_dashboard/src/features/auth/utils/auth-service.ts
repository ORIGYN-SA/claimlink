import { Actor } from "@dfinity/agent";
import { useAuth } from "../hooks/useAuth";

/**
 * Example service demonstrating how to use authenticated and unauthenticated agents
 * This is a template that can be adapted for your specific canister interactions
 */
export function useClaimLinkService() {
  const { authenticatedAgent, unauthenticatedAgent } = useAuth();

  // Helper function to get authenticated actor
  const getAuthenticatedActor = (canisterId: string, idlFactory: any) => {
    if (!authenticatedAgent) {
      throw new Error("User not authenticated");
    }

    return Actor.createActor(idlFactory, {
      agent: authenticatedAgent,
      canisterId,
    });
  };

  // Helper function to get public actor
  const getPublicActor = (canisterId: string, idlFactory: any) => {
    if (!unauthenticatedAgent) {
      throw new Error("Agent not initialized");
    }

    return Actor.createActor(idlFactory, {
      agent: unauthenticatedAgent,
      canisterId,
    });
  };

  return {
    // Authenticated methods (require user to be connected)
    async createCampaign(canisterId: string, idlFactory: any, data: any) {
      getAuthenticatedActor(canisterId, idlFactory);
      // Replace with your actual canister method
      // const actor = getAuthenticatedActor(canisterId, idlFactory);
      // return await actor.create_campaign(data);
      return { success: true, data };
    },

    async mintNFT(canisterId: string, idlFactory: any, data: any) {
      getAuthenticatedActor(canisterId, idlFactory);
      // Replace with your actual canister method
      // const actor = getAuthenticatedActor(canisterId, idlFactory);
      // return await actor.mint_nft(data);
      return { success: true, data };
    },

    // Public methods (can be called without authentication)
    async getCampaigns(canisterId: string, idlFactory: any) {
      getPublicActor(canisterId, idlFactory);
      // Replace with your actual canister method
      // const actor = getPublicActor(canisterId, idlFactory);
      // return await actor.get_public_campaigns();
      return { campaigns: [] };
    },

    async getCampaignDetails(canisterId: string, idlFactory: any, id: string) {
      getPublicActor(canisterId, idlFactory);
      // Replace with your actual canister method
      // const actor = getPublicActor(canisterId, idlFactory);
      // return await actor.get_campaign_details(id);
      return { id, details: {} };
    },
  };
}
