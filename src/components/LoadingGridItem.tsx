type LoadingGridItemProps = {
  action: string;
};
export default function LoadingGridItem({ action }: LoadingGridItemProps) {
  if (action === "POPULAR") {
    return (
      <div className="animate-pulse flex flex-col gap-2">
        <div className="aspect-video bg-neutral-400 rounded-lg"></div>
        <div className="flex gap-2">
          <div className="size-10 rounded-full bg-neutral-400"></div>
          <div className="flex flex-col gap-1 w-full">
            <div className="w-full h-4 bg-neutral-400 rounded-lg"></div>
            <div className="w-full h-3 bg-neutral-400 rounded-lg"></div>
            <div className="flex gap-1 w-full">
              <div className="w-1/2 h-3 bg-neutral-400 rounded-lg"></div>
              <div className="w-1/2 h-3 bg-neutral-400 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (action === "SEARCH") {
    return (
      <div className="animate-pulse flex w-full gap-4">
        <div className="w-5/12 min-w-[400px] aspect-video flex-shrink-0 bg-neutral-400 rounded-lg"></div>
        <div className="w-full flex flex-col gap-1">
          <div className="w-full h-6 bg-neutral-400 rounded-lg"></div>
          <div className="w-full h-6 bg-neutral-400 rounded-lg"></div>
          <div className="flex gap-2 items-center my-4">
            <div className="size-8 rounded-full bg-neutral-400 flex-shrink-0"></div>
            <div className="w-1/3 h-6 bg-neutral-400 rounded-lg"></div>
          </div>
          <div className="w-full h-6 bg-neutral-400 rounded-lg"></div>
        </div>
      </div>
    );
  }
}
