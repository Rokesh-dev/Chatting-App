const User = require("../users/User");
const {
  generateToken,
  generateHashedPassword,
  verifyPassword,
} = require("../../common/index.js");

const addUser = async (req, res) => {
  const { name, email, password, pic, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Please enter all the fields",
    });
  }
  try {
    const userExists = await User.findOne({ email }).exec();

    if (userExists) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "User already exists",
      });
    }

    const userCreated = await User.create(
      pic === undefined || pic.length === 0
        ? {
          name,
          email,
          password: await generateHashedPassword(password),
          role,
        }
        : {
          name,
          email,
          password: await generateHashedPassword(password),
          pic,
          role,
        }
    );

    if (userCreated) {
      return res.status(201).json({
        success: true,
        statusCode: 201,
        _id: userCreated._id,
        name: userCreated.name,
        email: userCreated.email,
        pic: userCreated.pic,
        role: userCreated.role,
        token: generateToken(userCreated._id, userCreated.email),
        message: "User Created Successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Failed to create the User",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

const editUser = async (req, res) => {
  const { userId, name, email, password, pic, role } = req.body;

  if (!userId || (!name && !email && !password && !pic && !role)) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Invalid request. Please provide valid user ID and at least one field to update.",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (password) {
      user.password = await generateHashedPassword(password);
    }

    if (pic) {
      user.pic = pic;
    }

    if (role) {
      user.role = role;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      role: user.role,
      message: "User updated successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

module.exports = { addUser, editUser };
