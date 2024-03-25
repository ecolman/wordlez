import { CircleHelp, Settings } from "lucide-react";

import InfoModal from "@/components/modals/info";
import SettingsModal from "@/components/modals/settings";
import useAppStore from "@/hooks/useAppStore";

export default function Header() {
  const { setShowInfoModal, setShowSettingsModal } = useAppStore();

  return (
    <>
      <div className="w-full flex items-center justify-between py-2 px-3 border-b border-gray-500">
        <div>
          <CircleHelp
            className="cursor-pointer text-black dark:text-white"
            size={30}
            onClick={() => setShowInfoModal(true)}
          />
        </div>
        <div className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Wordlez
        </div>
        <div>
          <Settings
            className="cursor-pointer text-black dark:text-white"
            size={30}
            onClick={() => setShowSettingsModal(true)}
          />
        </div>
      </div>

      <InfoModal />
      <SettingsModal />
    </>
  );
}
