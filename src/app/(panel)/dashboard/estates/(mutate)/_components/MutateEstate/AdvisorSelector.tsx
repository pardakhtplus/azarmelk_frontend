import { ICheck } from "@/components/Icons";
import CustomImage from "@/components/modules/CustomImage";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import { useAdviserList } from "@/services/queries/admin/estate/useAdviserList";
import { useEffect, useState } from "react";

// Advisor Selector Component
export default function AdvisorSelector({
  value,
  onChange,
  error,
}: {
  value?: string;
  onChange: (adviserId: string) => void;
  error?: any;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [advisors, setAdvisors] = useState<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      avatar?: {
        url: string;
      };
    }>
  >([]);

  const { adviserList } = useAdviserList({
    params: {
      page,
      limit: 10,
      search: searchQuery,
    },
  });

  // Update advisors list when userList changes
  useEffect(() => {
    if (adviserList?.data?.data?.advisers) {
      if (page === 1) {
        setAdvisors(adviserList.data.data.advisers);
      } else {
        setAdvisors((prev) => [
          ...prev,
          ...(adviserList.data?.data?.advisers || []),
        ]);
      }
    }
  }, [adviserList?.data?.data?.advisers, page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
    setAdvisors([]);
  };

  const loadMore = () => {
    if (
      adviserList?.data?.data?.pagination?.pageNumber &&
      adviserList?.data?.data?.pagination?.totalPages &&
      adviserList?.data?.data?.pagination?.pageNumber <
        adviserList?.data?.data?.pagination?.totalPages
    ) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="mt-1">
      {/* Search Input */}
      <div className="mb-3">
        <BorderedInput
          name="search"
          type="text"
          placeholder="جستجو شماره٬ نام و نام خانوادگی..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full rounded-lg border border-primary-border px-3 py-2 text-sm outline-none focus:border-black"
        />
      </div>

      {/* Advisors List */}
      <div className="max-h-60 overflow-y-auto rounded-lg border border-primary-border">
        {adviserList.isLoading && advisors.length === 0 ? (
          <div className="flex h-20 items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
          </div>
        ) : advisors.length === 0 ? (
          <div className="flex h-20 items-center justify-center text-sm text-gray-500">
            مشاوری یافت نشد
          </div>
        ) : (
          <>
            {advisors.map((advisor) => (
              <div
                key={advisor.id}
                className={`flex cursor-pointer items-center gap-3 border-b border-primary-border p-3 transition-colors hover:bg-gray-50 ${
                  value === advisor.id ? "!bg-primary/10" : ""
                }`}
                onClick={() => onChange(advisor.id)}>
                {/* Avatar */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  {advisor.avatar ? (
                    <CustomImage
                      src={
                        advisor.avatar.url || "/images/profile-placeholder.jpg"
                      }
                      alt={`${advisor.firstName} ${advisor.lastName}`}
                      className="h-full w-full rounded-full object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <span className="text-sm font-medium text-primary">
                      {advisor.firstName.charAt(0)}
                      {advisor.lastName.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {advisor.firstName} {advisor.lastName}
                  </p>
                </div>

                {/* Selection Indicator */}
                {value === advisor.id && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <ICheck className="size-3 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Load More Button */}
            {adviserList?.data?.data?.pagination?.totalPages &&
              adviserList?.data?.data?.pagination?.pageNumber &&
              adviserList?.data?.data?.pagination?.pageNumber <
                adviserList?.data?.data?.pagination?.totalPages && (
                <div className="border-t border-primary-border p-3">
                  <button
                    onClick={loadMore}
                    disabled={adviserList.isLoading}
                    className="w-full rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50">
                    {adviserList.isLoading
                      ? "در حال بارگذاری..."
                      : "نمایش بیشتر"}
                  </button>
                </div>
              )}
          </>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-xs text-red">{error.message}</p>}
    </div>
  );
}
