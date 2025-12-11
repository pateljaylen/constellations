import "./globals.css";

export const metadata = {
  title: "Constellation",
  description: "A modern ritual for becoming human together.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
