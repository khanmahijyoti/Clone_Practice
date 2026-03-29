import { readFile } from "node:fs/promises";
import path from "node:path";
import { TrySoroVideoFix } from "@/components/trysoro-video-fix";

export default async function Home() {
  const filePath = path.join(process.cwd(), "src", "content", "trysoro-main.html");
  const rawHtml = await readFile(filePath, "utf8");

  const html = rawHtml
    .replaceAll('srcset="/_next/image?', 'srcset="https://trysoro.com/_next/image?')
    .replaceAll(' /_next/image?', ' https://trysoro.com/_next/image?')
    .replaceAll(',/_next/image?', ',https://trysoro.com/_next/image?')
    .replaceAll('src="/_next/image?', 'src="https://trysoro.com/_next/image?')
    .replaceAll("src='/_next/image?", "src='https://trysoro.com/_next/image?")
    .replaceAll('poster="/', 'poster="https://trysoro.com/')
    .replaceAll("poster='/", "poster='https://trysoro.com/")
    .replaceAll('src="/', 'src="https://trysoro.com/')
    .replaceAll("src='/", "src='https://trysoro.com/")
    .replaceAll('url("/', 'url("https://trysoro.com/')
    .replaceAll("url('/", "url('https://trysoro.com/")
    .replaceAll('url(/', 'url(https://trysoro.com/')
    .replaceAll('src="https://trysoro.com/hero.webm"', 'src="/assets/trysoro/hero.webm"')
    .replaceAll('src="https://trysoro.com/valueproposition/glass-final.webm"', 'src="/assets/trysoro/valueproposition/glass-final.webm"')
    .replaceAll('src="https://trysoro.com/valueproposition/pencil-final.webm"', 'src="/assets/trysoro/valueproposition/pencil-final.webm"')
    .replaceAll('src="https://trysoro.com/light-bulb.webm"', 'src="/assets/trysoro/light-bulb.webm"')
    .replaceAll('src="https://trysoro.com/footer.webp"', 'src="/assets/trysoro/footer.webp"')
    .replaceAll('poster="https://trysoro.com/footer.webp"', 'poster="/assets/trysoro/footer.webp"')
    .replaceAll(
      '<video src="https://trysoro.com/hero.webm" autoplay="" loop="" playsinline="" class="w-full object-contain md:max-h-[640px] max-h-[400px]">',
      '<video src="/assets/trysoro/hero.webm" autoplay="" muted="" loop="" playsinline="" preload="auto" class="w-full object-contain md:max-h-[640px] max-h-[400px]">',
    )
    .replaceAll(
      '<video src="/assets/trysoro/hero.webm" autoplay="" loop="" playsinline="" class="w-full object-contain md:max-h-[640px] max-h-[400px]">',
      '<video src="/assets/trysoro/hero.webm" autoplay="" muted="" loop="" playsinline="" preload="auto" class="w-full object-contain md:max-h-[640px] max-h-[400px]">',
    );

  return (
    <div className="trysoro-root">
      <TrySoroVideoFix />
      <header className="sticky top-0 z-50 px-2 pt-3 md:px-4 md:pt-5">
        <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-center">
          <div className="flex w-full items-center justify-between gap-4 rounded-[32px] border border-[#f7f7f7] bg-white px-5 py-3 shadow-[0px_1px_1px_0px_#f7f7f7] md:w-auto md:min-w-[640px] md:px-8">
            <a href="https://trysoro.com" className="flex items-center gap-2">
              <img src="https://trysoro.com/icon.svg" alt="Soro" className="h-[30px] w-[30px]" />
              <span className="text-[20px] font-semibold leading-none tracking-[-0.02em]">Soro</span>
            </a>
            <div className="hidden items-center gap-12 md:flex">
              <a href="https://trysoro.com/pricing" className="text-[16px] font-medium text-[#7f7f7f] hover:text-[#555]">
                Pricing
              </a>
              <a href="https://trysoro.com/blog" className="text-[16px] font-medium text-[#7f7f7f] hover:text-[#555]">
                Blog
              </a>
              <a href="https://trysoro.com/login" className="text-[16px] font-medium text-[#7f7f7f] hover:text-[#555]">
                Login
              </a>
            </div>
            <a
              href="https://trysoro.com/pricing"
              className="inline-flex items-center rounded-[9999px] border-2 border-[#5855ff] px-5 py-2 text-[16px] font-semibold text-[#111] md:px-7 md:py-2.5"
            >
              Buy now
            </a>
          </div>
        </nav>
      </header>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <footer className="mt-16 bg-[#f3f3f3] px-4 py-14 text-[#8a8f98] md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-10">
              <div>
                <div className="mb-6 flex items-center gap-3 text-black">
                  <img src="https://trysoro.com/icon.svg" alt="Soro" className="h-9 w-9" />
                  <span className="text-[24px] font-semibold leading-none">Soro</span>
                </div>
                <p className="text-[18px] leading-[1.5]">Copyright © 2026</p>
                <p className="text-[18px] leading-[1.5]">DIGIMERI OÜ</p>
                <p className="text-[18px] leading-[1.5]">All rights reserved</p>
              </div>
              <div className="pt-1 text-black">
                <p className="text-[40px] font-semibold leading-none">4.8</p>
                <p className="mt-3 text-[28px] leading-none">Excellent</p>
                <img src="https://trysoro.com/5-stars.svg" alt="Trustpilot stars" className="mt-3 h-7 w-auto" />
                <p className="mt-2 text-[18px] leading-none">Trustpilot</p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-12">
            <div>
              <h3 className="mb-5 text-[24px] font-medium text-black">Product</h3>
              <a className="block text-[18px] leading-[1.8] hover:text-[#5b5f67]" href="https://trysoro.com/pricing">
                Pricing
              </a>
              <a className="block text-[18px] leading-[1.8] hover:text-[#5b5f67]" href="https://wordpress.org/plugins/soro-ai-content-writer/">
                WordPress Plugin
              </a>
            </div>
            <div>
              <h3 className="mb-5 text-[24px] font-medium text-black">Policies</h3>
              <a className="block text-[18px] leading-[1.8] hover:text-[#5b5f67]" href="https://trysoro.com/terms-of-service">
                Terms of Service
              </a>
              <a className="block text-[18px] leading-[1.8] hover:text-[#5b5f67]" href="https://trysoro.com/privacy-policy">
                Privacy Policy
              </a>
            </div>
            <div>
              <h3 className="mb-5 text-[24px] font-medium text-black">Social</h3>
              <a className="block text-[18px] leading-[1.8] hover:text-[#5b5f67]" href="https://www.linkedin.com/company/trysoro/">
                LinkedIn
              </a>
              <a className="block text-[18px] leading-[1.8] hover:text-[#5b5f67]" href="https://www.facebook.com/people/Soro/61574138502944/">
                Facebook
              </a>
            </div>
            <div>
              <h3 className="mb-5 text-[24px] font-medium text-black">Contact</h3>
              <a className="block text-[18px] leading-[1.8] hover:text-[#5b5f67]" href="mailto:info@trysoro.com">
                info@trysoro.com
              </a>
              <a className="block text-[18px] leading-[1.8] hover:text-[#5b5f67]" href="https://trysoro.com/for-agencies">
                For Agencies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
