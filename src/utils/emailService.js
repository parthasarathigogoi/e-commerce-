// This is a mock email service for demo purposes
// In a real application, you would use a proper email service like SendGrid, Mailgun, etc.

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    // In a real app, this would send an actual email
    console.log(`Sending verification code ${verificationCode} to ${email}`);
    
    // For demo purposes, we'll simulate sending an email
    // In a real app, you would use an API call to your backend
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log the verification code to the console for demo purposes
    console.log(`Email sent to ${email} with verification code: ${verificationCode}`);
    
    // For demo purposes, show an alert with the verification code
    // In a real app, this would be removed
    alert(`For demo purposes: Verification code ${verificationCode} would be sent to ${email} (imjunahmed6@gmail.com)`);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: 'Failed to send verification email' };
  }
}; 