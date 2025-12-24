import React, { useEffect, useState, useRef } from 'react';
import uniqid from 'uniqid';
import Quill from 'quill';
import { assets } from '../../assets/assets';

const AddCourses = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  // Initialize Quill
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

  // Chapter handler
  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter chapter name');
      if (!title) return;

      setChapters(prev => [
        ...prev,
        {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: prev.length + 1,
        },
      ]);
    }

    if (action === 'remove') {
      setChapters(prev =>
        prev.filter(ch => ch.chapterId !== chapterId)
      );
    }

    if (action === 'toggle') {
      setChapters(prev =>
        prev.map(ch =>
          ch.chapterId === chapterId
            ? { ...ch, collapsed: !ch.collapsed }
            : ch
        )
      );
    }
  };

  // Lecture handler
  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    }

    if (action === 'remove') {
      setChapters(prev =>
        prev.map(ch =>
          ch.chapterId === chapterId
            ? {
                ...ch,
                chapterContent: ch.chapterContent.filter(
                  (_, i) => i !== lectureIndex
                ),
              }
            : ch
        )
      );
    }
  };

  // Add lecture
  const addLecture = () => {
    setChapters(prev =>
      prev.map(ch => {
        if (ch.chapterId === currentChapterId) {
          return {
            ...ch,
            chapterContent: [
              ...ch.chapterContent,
              {
                ...lectureDetails,
                lectureId: uniqid(),
                lectureOrder: ch.chapterContent.length + 1,
              },
            ],
          };
        }
        return ch;
      })
    );

    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
    setShowPopup(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log({
      courseTitle,
      coursePrice,
      discount,
      image,
      chapters,
      description: quillRef.current?.root.innerHTML,
    });
  };

  return (
    <div className="h-screen overflow-scroll p-4 md:p-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md w-full text-gray-500"
      >
        <input
          value={courseTitle}
          onChange={e => setCourseTitle(e.target.value)}
          placeholder="Course Title"
          className="border p-2 rounded"
          required
        />

        <div ref={editorRef} className="bg-white" />

        <input
          type="number"
          value={coursePrice}
          onChange={e => setCoursePrice(e.target.value)}
          placeholder="Price"
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          value={discount}
          onChange={e => setDiscount(e.target.value)}
          placeholder="Discount %"
          min={0}
          max={100}
          className="border p-2 rounded"
        />

        <label htmlFor="thumbnailImage" className="flex gap-2 items-center">
          <img src={assets.file_upload_icon} alt="" />
          <input
            id="thumbnailImage"
            type="file"
            hidden
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
          />
        </label>

        {chapters.map((chapter, i) => (
          <div key={chapter.chapterId} className="border rounded p-3">
            <div className="flex justify-between">
              <span>
                {i + 1}. {chapter.chapterTitle}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleChapter('toggle', chapter.chapterId)
                }
              >
                Toggle
              </button>
            </div>

            {!chapter.collapsed &&
              chapter.chapterContent.map((lec, idx) => (
                <div key={lec.lectureId} className="flex justify-between">
                  <span>
                    {idx + 1}. {lec.lectureTitle} – {lec.lectureDuration} min
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleLecture('remove', chapter.chapterId, idx)
                    }
                  >
                    ❌
                  </button>
                </div>
              ))}

            <button
              type="button"
              onClick={() => handleLecture('add', chapter.chapterId)}
            >
              + Add Lecture
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => handleChapter('add')}
          className="bg-blue-100 p-2 rounded"
        >
          + Add Chapter
        </button>

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded"
        >
          ADD COURSE
        </button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-80">
            <input
              placeholder="Lecture Title"
              value={lectureDetails.lectureTitle}
              onChange={e =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureTitle: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
            />

            <input
              placeholder="Duration"
              type="number"
              value={lectureDetails.lectureDuration}
              onChange={e =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureDuration: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
            />

            <input
              placeholder="Lecture URL"
              value={lectureDetails.lectureUrl}
              onChange={e =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureUrl: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
            />

            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={lectureDetails.isPreviewFree}
                onChange={e =>
                  setLectureDetails({
                    ...lectureDetails,
                    isPreviewFree: e.target.checked,
                  })
                }
              />
              Free Preview
            </label>

            <button
              onClick={addLecture}
              className="bg-blue-500 text-white w-full mt-3 p-2 rounded"
            >
              ADD
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourses;
