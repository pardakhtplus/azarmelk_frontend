import CustomImage from "@/components/modules/CustomImage";
import { type TSession } from "@/types/admin/session/type";

interface SessionCreatorProps {
  creator: TSession["creator"];
}

export default function SessionCreator({ creator }: SessionCreatorProps) {
  if (!creator) return null;
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between border-b border-primary-border/30 pb-3">
        <h2 className="text-xl font-medium">ایجاد کننده جلسه</h2>
      </div>
      <div className="mt-5">
        <div className="flex items-center gap-3">
          <div className="size-12 overflow-hidden rounded-full">
            <CustomImage
              src="/images/profile-placeholder.jpg"
              alt="avatar"
              width={48}
              height={48}
              className="size-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">
              {creator.firstName} {creator.lastName}
            </p>
            <p className="text-sm text-gray-600">{creator.phoneNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
