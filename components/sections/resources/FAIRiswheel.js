import React, { useState } from "react";
import SimpleExpansionPanel from "../../elements/expansion-panel";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FairIsWheelSVG from "./clickable-wheel"

export default function FAIRiswheel(data) {
  console.log(data)
  const [contentTitle, setcontentTitle] = useState({
    title: "Heal Platform",
  });
  const [faqs, setFaqs] = useState(data.data.faqs_heal_platform);
  const [qna, setQna] = useState(data.data.qanda_heal_platform);
  const [videos, setVideos] = useState(data.data.video_heal_platform);
  const [documents, setDocuments] = useState(data.data.documents_heal_platform);
  return (
    <div className="container flex mdmax:flex-wrap">
      <section className="">
        <FairIsWheelSVG
          setcontentTitle={setcontentTitle}
          setFaqs={setFaqs}
          setQna={setQna}
          setVideos={setVideos}
          setDocuments={setDocuments}
          data={data.data}
        />
      </section>
      <section className="w-full large:ml-10 mb-10">
        <h1 className="text-4xl font-black pb-4 text-purple">
          {contentTitle.title}
        </h1>
        <div
          style={{
            background: "#e5e0e738",
            padding: "34px 0 34px 0",
            boxShadow:
              "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
          }}
        >
          <div className="container">
            {faqs.length > 0 && (
              <>
                <h1 className="text-purple text-2xl mb-5">
                  Frequently Asked Questions (FAQs)
                </h1>
                <SimpleExpansionPanel data={faqs} />
              </>
            )}
            {qna.length > 0 && (
              <>
                <h1 className="text-purple text-2xl mb-5 mt-5">
                  {`Questions and Answers (Q&A)`}
                </h1>
                <SimpleExpansionPanel data={qna} />
              </>
            )}
            {documents.length > 0 && (
              <>
                <h1 className="text-purple text-2xl mb-5 mt-5">Documents</h1>
                {documents.map((doc, i) => {
                  console.log(doc);
                  return (
                    <a
                      key={doc.url + i}
                      href={doc.url}
                      download
                      style={{ color: "#532565", margin: "0 20px 0 0" }}
                    >
                      <FileDownloadIcon />
                      {doc.name}
                    </a>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
