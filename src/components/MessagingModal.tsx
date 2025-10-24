
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const MessagingModal: React.FC<MessagingModalProps> = ({ isOpen, onClose, company }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          recipient_id: company.founderId,
          company_id: company.id,
          content: message.trim(),
        });

      if (error) throw error;

      toast.success("Message sent successfully!");
      setMessage("");
      onClose();
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {company.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            Send a message to the founder of {company.name} about their startup.
          </p>
          
          <Textarea
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage} 
            disabled={isSending || !message.trim()}
            className="bg-gradient-to-r from-[#ff4141] to-[#ff6b41] text-white"
          >
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessagingModal;
