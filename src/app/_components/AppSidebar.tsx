import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import { PanelLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Article = {
  title: string;
  id: string;
};

type AppSidebarProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setSelectedArticleId: React.Dispatch<React.SetStateAction<string>>;
  selectedArticleId: string;
};

export function AppSidebar({
  setStep,
  setSelectedArticleId,
  selectedArticleId,
}: AppSidebarProps) {
  const [articleData, setArticleData] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const widths = ["w-50", "w-44", "w-48"];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const responseArticle = await axios.get("/api/articles");
        setArticleData(responseArticle.data.articles);
        setSelectedArticleId(responseArticle.data.articles[0]?.id || "");
        console.log("Articles fetched:", responseArticle.data);
      } catch (error) {
        console.error("Error articles fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Sidebar
      className="border-r border-stone-300/80 bg-[#f7f0e2]/85 backdrop-blur"
      collapsible="offcanvas"
    >
      <SidebarHeader className="border-b border-stone-300/80 bg-[#f7f0e2]/90 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-[family:var(--font-display)] text-lg font-semibold tracking-[0.01em] text-stone-900">
              History
            </h2>
            <p className="mt-1 text-[13px] uppercase tracking-[0.12em] text-stone-500">
              Previously generated articles
            </p>
          </div>
          <SidebarTrigger
            variant="ghost"
            size="icon"
            className="hidden h-9 w-9 rounded-md border border-stone-300 bg-[#fff7ec] text-stone-600 transition-colors hover:bg-[#f1a94e] hover:text-[#17332d] md:flex"
          >
            <PanelLeftIcon className="size-4" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-transparent px-3 py-4">
        {loading ? (
          <div className="mt-1.5 flex flex-col gap-4 px-2">
            {Array.from({ length: 30 }).map((_, index) => (
              <Skeleton
                key={index}
                className={`h-4 rounded-full ${widths[index % widths.length]}`}
              />
            ))}
          </div>
        ) : articleData.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
            <p className="font-[family:var(--font-display)] text-base font-semibold tracking-[0.01em] text-stone-700">
              No history yet
            </p>
            <p className="text-[13px] leading-6 text-stone-500">
              Your saved articles will appear here
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {articleData.map((article, index) => (
              <Button
                onClick={() => {
                  setSelectedArticleId(article.id);
                  setStep(5);
                }}
                variant="ghost"
                key={index}
                className={cn(
                  "h-auto w-full justify-start rounded-xl border border-transparent px-3 py-3 text-left text-[15px] font-medium leading-6 text-stone-700 shadow-none transition-colors hover:border-[#e0c59f] hover:bg-[#fff8ee] hover:text-stone-950",
                  article.id === selectedArticleId &&
                    "border-[#d8b076] bg-[#f3d6a8]/55 text-stone-950"
                )}
              >
                <span className="line-clamp-3 whitespace-normal break-words">
                  {article.title}
                </span>
              </Button>
            ))}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
