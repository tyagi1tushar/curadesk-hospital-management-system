import React, { useRef, useState } from "react";
import { doctorDetailStyles } from "../assets/dummyStyles";
import { User, XCircle, Plus, Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const s = doctorDetailStyles;

const AddPage = () => {
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        name: "",
        specialization: "",
        imageFile: null,
        imagePreview: "",
        experience: "",
        qualifications: "",
        location: "",
        about: "",
        fee: "",
        patients: "",
        rating: "",
        schedule: {},
        availability: "Available",
        email: "",
        password: "",
    });


    const [slotDate, setSlotDate] = useState(null);
    const [slotTime, setSlotTime] = useState(null);
    const [loading, setLoading] = useState(false);

    // ================= IMAGE =================
    function handleImage(e) {
        const file = e.target.files[0];
        if (!file) return;

        setForm((p) => ({
            ...p,
            imageFile: file,
            imagePreview: URL.createObjectURL(file),
        }));
    }

    function removeImage() {
        setForm((p) => ({ ...p, imageFile: null, imagePreview: "" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    // ================= SCHEDULE =================
    function addSlot() {
        if (!slotDate || !slotTime) return;

        const date = slotDate.toISOString().split("T")[0];

        const time = slotTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        setForm((prev) => {
            const newSchedule = { ...prev.schedule };
            if (!newSchedule[date]) newSchedule[date] = [];

            newSchedule[date].push(time);

            return { ...prev, schedule: newSchedule };
        });

        setSlotTime(null);
    }

    function removeSlot(date, time) {
        setForm((prev) => {
            const newSchedule = { ...prev.schedule };
            newSchedule[date] = newSchedule[date].filter((t) => t !== time);

            if (!newSchedule[date].length) delete newSchedule[date];

            return { ...prev, schedule: newSchedule };
        });
    }

    // ================= VALIDATION =================
    function validate() {
        const req = [
            "name",
            "specialization",
            "experience",
            "qualifications",
            "location",
            "about",
            "fee",
            "patients",
            "rating",
            "email",
            "password",
        ];

        for (let k of req) if (!form[k]) return false;
        if (!form.imageFile) return false;
        if (!Object.keys(form.schedule).length) return false;

        return true;
    }

    // ================= SUBMIT =================
    async function handleAdd(e) {
        e.preventDefault();

        if (!validate()) {
            alert("Fill all fields + add schedule");
            return;
        }

        try {
            setLoading(true);

            const fd = new FormData();

            fd.append("name", form.name);
            fd.append("specialization", form.specialization);
            fd.append("experience", form.experience);
            fd.append("qualifications", form.qualifications);
            fd.append("location", form.location);
            fd.append("about", form.about);
            fd.append("fee", form.fee);
            fd.append("patients", form.patients);
            fd.append("rating", form.rating);
            fd.append("availability", form.availability);
            fd.append("email", form.email);
            fd.append("password", form.password);

            fd.append("schedule", JSON.stringify(form.schedule));

            if (form.imageFile) {
                fd.append("image", form.imageFile);
            }

            const res = await fetch("http://localhost:4000/api/doctors", {
                method: "POST",
                body: fd,
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok) throw new Error();

            alert("Doctor Added Successfully");

            // RESET
            setForm({
                name: "",
                specialization: "",
                imageFile: null,
                imagePreview: "",
                experience: "",
                qualifications: "",
                location: "",
                about: "",
                fee: "",
                patients: "",
                rating: "",
                schedule: {},
                availability: "Available",
                email: "",
                password: "",
            });

            setSlotDate(null);
            setSlotTime(null);
        } catch (err) {
            console.error(err);
            alert("Error adding doctor");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center py-10 px-4">
            <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-semibold text-teal-600 text-center mb-8">
                    Add New Doctor
                </h1>

                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* IMAGE */}
                    <div className="col-span-1 md:col-span-2 flex justify-center">
                        <div className="relative w-32 h-32 border-2 border-dashed rounded-full flex items-center justify-center overflow-hidden">

                            {form.imagePreview ? (
                                <>
                                    <img
                                        src={form.imagePreview}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <p className="text-gray-400 text-center text-sm">
                                    Upload Image
                                </p>
                            )}

                            <input
                                type="file"
                                onChange={handleImage}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* INPUTS */}
                    {[
                        ["name", "Full Name"],
                        ["specialization", "Specialization"],
                        ["location", "Location"],
                        ["experience", "Experience"],
                        ["qualifications", "Qualifications"],
                        ["fee", "Fee"],
                        ["patients", "Patients"],
                        ["rating", "Rating (1-5)"],
                        ["email", "Email"],
                        ["password", "Password"],
                    ].map(([key, placeholder]) => (
                        <input
                            key={key}
                            type={key === "password" ? "password" : "text"}
                            placeholder={placeholder}
                            value={form[key]}
                            onChange={(e) =>
                                setForm({ ...form, [key]: e.target.value })
                            }
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    ))}

                    {/* AVAILABILITY */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() =>
                                setForm({ ...form, availability: "Available" })
                            }
                            className={`px-4 py-2 rounded-lg border ${form.availability === "Available"
                                    ? "bg-green-500 text-white"
                                    : ""
                                }`}
                        >
                            Available
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setForm({ ...form, availability: "Unavailable" })
                            }
                            className={`px-4 py-2 rounded-lg border ${form.availability === "Unavailable"
                                    ? "bg-red-500 text-white"
                                    : ""
                                }`}
                        >
                            Unavailable
                        </button>
                    </div>

                    {/* ABOUT */}
                    <textarea
                        placeholder="About Doctor"
                        value={form.about}
                        onChange={(e) =>
                            setForm({ ...form, about: e.target.value })
                        }
                        className="col-span-1 md:col-span-2 p-3 border rounded-xl h-28"
                    />

                    {/* SCHEDULE */}
                    <div className="col-span-1 md:col-span-2 flex gap-4 flex-wrap">
                        <DatePicker
                            selected={slotDate}
                            onChange={(d) => setSlotDate(d)}
                            placeholderText="Select Date"
                            className="p-3 border rounded-xl"
                        />

                        <DatePicker
                            selected={slotTime}
                            onChange={(t) => setSlotTime(t)}
                            showTimeSelect
                            showTimeSelectOnly
                            dateFormat="hh:mm aa"
                            placeholderText="Select Time"
                            className="p-3 border rounded-xl"
                        />

                        <button
                            type="button"
                            onClick={addSlot}
                            className="bg-teal-600 text-white px-4 rounded-xl"
                        >
                            + Add Slot
                        </button>
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="col-span-1 md:col-span-2 bg-teal-600 text-white py-3 rounded-xl"
                    >
                        {loading ? "Adding..." : "Add Doctor"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddPage;