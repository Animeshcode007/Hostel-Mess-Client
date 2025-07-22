import React, { useState } from "react";
import Header from "../components/Header";
import Modal from "../components/Modal";
import Instructions from "../components/Instructions";
import MenuTable from "../components/MenuTable";
import Committee from "../components/Committee";
import RaiseIssueForm from "../components/RaiseIssueForm";

function HomePage() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  return (
    <>
        <title>IET DAVV Hostel Mess</title>
        <meta
          name="description"
          content="View the official weekly menu, important instructions, and committee details for the IET DAVV Hostel Mess. Raise issues and stay updated with mess information."
        />
        <meta
          name="keywords"
          content="IET DAVV, Hostel Mess, IET Mess Menu, DAVV Indore, College Mess,IET DAVV Hostel Mess"
        />
      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

        <div className="relative z-10 flex flex-col min-h-screen text-white">
          <Header />

          <main className="flex-grow flex flex-col items-center justify-center p-4">
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
              <button
                onClick={() => openModal("instructions")}
                className="main-button"
              >
                Instructions
              </button>
              <button onClick={() => openModal("menu")} className="main-button">
                Menu
              </button>
              <button
                onClick={() => openModal("committee")}
                className="main-button"
              >
                Committee
              </button>
            </div>
          </main>

          <footer className="text-center p-4 text-white font-semibold text-sm sm:text-base">
            On Sunday, food will be available only in the morning
          </footer>
        </div>

        <button
          onClick={() => openModal("issue")}
          className="raise-issue-button fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-20"
        >
          Raise An Issue
        </button>
        <Modal
          isOpen={activeModal === "instructions"}
          onClose={closeModal}
          title="Instructions"
        >
          <Instructions />
        </Modal>

        <Modal
          isOpen={activeModal === "menu"}
          onClose={closeModal}
          title="Menu"
        >
          <MenuTable />
        </Modal>

        <Modal
          isOpen={activeModal === "committee"}
          onClose={closeModal}
          title="Committee"
        >
          <Committee />
        </Modal>

        <Modal
          isOpen={activeModal === "issue"}
          onClose={closeModal}
          title="Raise an Issue"
        >
          <RaiseIssueForm onClose={closeModal} />
        </Modal>
      </div>
    </>
  );
}

export default HomePage;
