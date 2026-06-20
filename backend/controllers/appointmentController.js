import Appointment from "../models/Appointment.js";

export const bookAppointment = async (
  req,
  res
) => {
  try {
    console.log("BOOK APPOINTMENT HIT");
    console.log(req.body);

    const {
      doctorName,
      patientName,
      appointmentDate,
    } = req.body;

    const existingAppointment =
  await Appointment.findOne({
    doctorName,
    appointmentDate,
    userId: req.user.id,
  });

    console.log(
      "Existing:",
      existingAppointment
    );

    if (existingAppointment) {
      return res.status(400).json({
        message:
          "Appointment already booked",
      });
    }

   const appointment =
  await Appointment.create({
    doctorName,
    patientName,
    appointmentDate,
    userId: req.user.id,
    status: "Upcoming",
  });

    res.json(appointment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Failed to book appointment",
    });
  }
};

export const getAppointments = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

const appointments =
  await Appointment.find({
    userId,
  }).sort({
    createdAt: -1,
  });

    res.json(appointments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Failed to fetch appointments",
    });
  }
};

export const cancelAppointment =
  async (req, res) => {
    try {
      const { id } = req.params;

     const appointment =
  await Appointment.findOne({
    _id: id,
    userId: req.user.id,
  });

      if (!appointment) {
        return res.status(404).json({
          message:
            "Appointment not found",
        });
      }

      await Appointment.deleteOne({
  _id: id,
  userId: req.user.id,
});
      res.json({
        message:
          "Appointment cancelled successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to cancel appointment",
      });
    }
  };