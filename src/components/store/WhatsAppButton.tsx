export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/96170888898?text=Hi%20SitnDip%2C%20I%20want%20to%20order"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M12 2a9.9 9.9 0 00-8.5 14.9L2 22l5.3-1.4A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1112 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 01-1.9-1.2 7.2 7.2 0 01-1.3-1.6c-.1-.2 0-.4.1-.5l.4-.4.1-.3c0-.1 0-.3 0-.4s-.5-1.3-.7-1.8-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3a2.4 2.4 0 00-.8 1.8 4.2 4.2 0 00.9 2.2 9.6 9.6 0 003.7 3.3 12 12 0 002 .7 3 3 0 002-.7 2.5 2.5 0 00.8-1.7c0-.2 0-.2-.1-.3z" />
      </svg>
    </a>
  );
}
