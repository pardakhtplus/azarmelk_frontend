"use client";

import { IPhoneWhite } from "@/components/Icons";
import BorderedButton from "@/components/modules/buttons/BorderedButton";
import Button from "@/components/modules/buttons/Button";
import CustomImage from "@/components/modules/CustomImage";
import Modal from "@/components/modules/Modal";
import { cn } from "@/lib/utils";
import usePostAdvisorContactLog from "@/services/mutations/client/estate/usePostAdvisorContactLog";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdvisorCard({
  adviser,
  className,
  estateId,
}: {
  adviser?: {
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
    avatar: {
      url: string;
      file_name: string;
      key: string;
      mimeType: string;
    };
  };
  className?: string;
  estateId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { postAdvisorContactLog } = usePostAdvisorContactLog();

  const { userInfo } = useUserInfo();

  const handleContactClick = async () => {
    if (userInfo.data?.data.phoneNumber) {
      await postAdvisorContactLog.mutateAsync({
        data: {
          estateId: estateId,
        },
      });
      setIsModalOpen(true);
    } else {
      // Redirect to login page
      router.push("/auth/login");
    }
  };

  const handleCallAdvisor = () => {
    window.location.href = `tel:${adviser?.phoneNumber}`;
  };

  return (
    <>
      <section
        className={cn(
          "flex w-full animate-fade-up cursor-pointer flex-col items-start justify-start gap-6 border-y border-primary-border px-3 py-6 transition-transform duration-300 xs:flex-row xs:items-center xs:justify-between",
          className,
        )}>
        <div className="flex items-start gap-3">
          <div className="flex size-[53px] items-center justify-center overflow-hidden rounded-full bg-primary/30">
            {adviser?.avatar?.url ? (
              <CustomImage
                src={adviser.avatar.url}
                alt={adviser.firstName + " " + adviser.lastName}
                width={53}
                height={53}
                className="size-[53px] object-cover"
              />
            ) : (
              <span className="text-lg font-semibold">
                {adviser?.firstName?.[0]} {adviser?.lastName?.[0]}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-[5px] pt-[3px] text-lg font-normal">
            <p>
              {adviser?.firstName} {adviser?.lastName}
            </p>
            <p className="text-xs text-text-100">مشاور</p>
          </div>
        </div>

        <button
          onClick={handleContactClick}
          className="group flex h-fit w-fit items-center gap-2.5 rounded-[30px] bg-[#002679] px-5 py-3 transition-transform duration-200">
          <span className="group-hover:animate-ring">
            <IPhoneWhite />
          </span>
          <span className="text-xs font-normal text-white">تماس با مشاور</span>
        </button>
      </section>

      {/* Advisor Information Modal */}
      <Modal
        isOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
        onClickOutside={() => setIsModalOpen(false)}
        title="اطلاعات مشاور"
        classNames={{
          box: "max-w-md !max-h-fit !h-fit",
        }}>
        <div className="p-6">
          <div className="flex flex-col items-center gap-6">
            {/* Advisor Avatar */}
            <div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-primary/30">
              {adviser?.avatar?.url ? (
                <CustomImage
                  src={adviser.avatar.url}
                  alt={adviser.firstName + " " + adviser.lastName}
                  width={96}
                  height={96}
                  className="size-24 object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold">
                  {adviser?.firstName?.[0]} {adviser?.lastName?.[0]}
                </span>
              )}
            </div>

            {/* Advisor Information */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {adviser?.firstName} {adviser?.lastName}
              </h3>
              <p className="mt-1 text-sm text-gray-600">مشاور</p>
            </div>

            {/* Contact Information */}
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <span className="text-sm font-medium text-gray-700">
                  شماره تماس:
                </span>
                <span className="font-mono text-sm text-gray-900">
                  {adviser?.phoneNumber}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full gap-3">
              <Button
                onClick={handleCallAdvisor}
                className="flex flex-1 items-center justify-center gap-2 bg-[#002679] px-4 py-3 text-white transition-colors hover:bg-[#001a5c]">
                <IPhoneWhite />
                <span className="text-sm font-medium">تماس</span>
              </Button>
              <BorderedButton
                onClick={() => setIsModalOpen(false)}
                className="flex flex-1 items-center justify-center gap-2 border border-gray-300 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50">
                <span className="text-sm font-medium">بستن</span>
              </BorderedButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
