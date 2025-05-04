
/**
 * Authentication verification utility for AILifestyle integration
 */

// We'd use jose in a real implementation, but for this example
// we'll create a simplified verification function
export async function verifyAILifestyleToken(token: string): Promise<{ 
  valid: boolean; 
  userId?: string;
  appId?: string;
  error?: string;
}> {
  if (!token) {
    return { valid: false, error: 'No token provided' };
  }

  try {
    // For demonstration purposes only - in a real app,
    // we would use the jose library to verify the JWT
    
    // This is a simplified implementation
    // In reality, we would decode and verify the JWT signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' };
    }
    
    // Base64 decode the payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Token expired' };
    }
    
    // Check app ID
    const currentAppId = getCurrentAppId();
    if (payload.app !== currentAppId) {
      return { 
        valid: false, 
        error: 'Token is not valid for this application' 
      };
    }

    return { 
      valid: true, 
      userId: payload.sub as string,
      appId: payload.app as string
    };
    
  } catch (error) {
    console.error('Token verification error:', error);
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Unknown error verifying token' 
    };
  }
}

// Helper function to get the current app's ID
function getCurrentAppId(): string {
  return 'nutrisnap'; 
}
