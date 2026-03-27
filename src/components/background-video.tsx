export function BackgroundVideo() {
  return (
    <div className="fixed inset-0 z-0">
      <video autoPlay loop muted playsInline className="h-full w-full object-cover">
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-background/72 via-background/58 to-background/88" />
    </div>
  );
}
