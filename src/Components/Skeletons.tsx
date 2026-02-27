type SkeletonVariant = "product-grid" | "category-grid" | "product-detail" | "cart";

interface SkeletonProps {
  variant: SkeletonVariant;
  count?: number; 
}

const Shimmer = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

// ─── Variants 

const ProductGridSkeleton = ({ count = 8 }: { count: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
        <Shimmer className="h-[220px] sm:h-[260px] w-full rounded-none" />
        <div className="p-4 flex flex-col gap-3">
          <Shimmer className="h-3 w-1/3 rounded-full" />
          <Shimmer className="h-4 w-3/4 rounded-full" />
          <div className="flex items-center justify-between mt-1">
            <Shimmer className="h-5 w-16 rounded-full" />
            <Shimmer className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CategoryGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2">
    {Array.from({ length: 2 }).map((_, i) => (
      <div key={i} className="bg-gray-100 h-[320px] sm:h-[480px] lg:h-[600px] flex flex-col justify-between p-6 sm:p-8 lg:p-10 animate-pulse">
        <div className="flex-1 flex items-center justify-center">
          <Shimmer className="w-[160px] sm:w-[220px] h-[160px] sm:h-[220px]" />
        </div>
        <div className="flex items-end justify-between mt-6">
          <div className="flex flex-col gap-2">
            <Shimmer className="h-6 w-28 rounded-full" />
            <Shimmer className="h-6 w-20 rounded-full" />
          </div>
          <Shimmer className="h-12 w-12 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

const ProductDetailSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 animate-pulse">
    <div className="flex-1 flex flex-col gap-3">
      <Shimmer className="w-full h-[340px] sm:h-[460px] lg:h-[560px]" />
      <div className="flex gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Shimmer key={i} className="w-20 h-20 flex-shrink-0" />
        ))}
      </div>
    </div>
    <div className="flex-1 flex flex-col gap-5">
      <Shimmer className="h-3 w-24 rounded-full" />
      <Shimmer className="h-8 w-3/4 rounded-full" />
      <Shimmer className="h-6 w-20 rounded-full" />
      <div className="flex flex-col gap-2">
        <Shimmer className="h-3 w-full rounded-full" />
        <Shimmer className="h-3 w-5/6 rounded-full" />
        <Shimmer className="h-3 w-4/6 rounded-full" />
      </div>
      <div className="flex gap-2 mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Shimmer key={i} className="w-10 h-10 rounded-lg" />
        ))}
      </div>
      <Shimmer className="h-12 w-full rounded-xl mt-2" />
    </div>
  </div>
);

const CartSkeleton = () => (
  <div className="flex flex-col gap-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 flex gap-4 sm:gap-6 animate-pulse">
        <Shimmer className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] flex-shrink-0" />
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2 flex-1">
              <Shimmer className="h-4 w-3/4 rounded-full" />
              <Shimmer className="h-3 w-1/2 rounded-full" />
            </div>
            <Shimmer className="h-5 w-16 rounded-full ml-4" />
          </div>
          <div className="flex items-center justify-between">
            <Shimmer className="h-8 w-28 rounded-full" />
            <div className="flex gap-2">
              <Shimmer className="h-8 w-8 rounded-full" />
              <Shimmer className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Main Export 

const Skeleton = ({ variant, count = 8 }: SkeletonProps) => {
  switch (variant) {
    case "product-grid":    return <ProductGridSkeleton count={count} />;
    case "category-grid":  return <CategoryGridSkeleton />;
    case "product-detail": return <ProductDetailSkeleton />;
    case "cart":           return <CartSkeleton />;
    default:               return null;
  }
};

export default Skeleton;