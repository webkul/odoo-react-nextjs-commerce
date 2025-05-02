"use server";
import { TOKEN } from "lib/constants";
import { createCart, createUserToLogin, getCart, recoverUserLogin } from "lib/odoo";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { RegisterInputType } from "~lib/odoo/types";

/**
 *  Define schema and method for create form validation
 * @param prevState
 * @param formData
 * @returns
 */

const schema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    firstname: z.string().min(2, { message: "Name must be at least 2 characters long." }).trim(),
    password: z.string().min(6, { message: "Be at least 6 characters long" }).trim(),
    passwordConfirmation: z.string().min(6, { message: "Be at least 6 characters long" }).trim(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password and confirm password don't match",
    path: ["confirm"],
  });

export type State = {
  errors: {
    apiError?: string[];
    firstname?: string[];
    email?: string[];
    password?: string[];
    passwordConfirmation?: string[];
    confirm?: string[];
  };
};

export async function createUser(prevState: State, formData: FormData) {
  // Ensure formData is defined
  const createUserValues = {
    firstname: formData.get("firstName"),
    lastname: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  };

  const validatedFields = schema.safeParse(createUserValues);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const result = await createUserToLogin(createUserValues as RegisterInputType);
  if (!result?.success) {
    return {
      errors: { apiError: result?.message },
    };
  } else {
    redirect("/customer/login");
  }
}
/**
 *  Define schema and method for forget Password validation
 * @param prevState
 * @param formData
 * @returns
 */
const forgetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
});

export type RecoverPasswordType = {
  errors: {
    email?: string[];
    apiRes?: {
      status: boolean;
      msg: string;
    };
  };
};
export async function recoverPassword(prevState: RecoverPasswordType, formData: FormData) {
  const data = {
    email: formData.get("email"),
  };
  const validatedFields = forgetSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const result = await recoverUserLogin(data as { email: string });
  if (!result?.success) {
    return {
      errors: {
        apiRes: {
          status: false,
          msg: result?.message,
        },
      },
    };
  }
  return {
    errors: {
      apiRes: {
        status: true,
        msg: result?.message,
      },
    },
  };
}

export async function userLogoOut() {
  try {
    (await cookies()).delete(TOKEN);
    (await cookies()).delete("order_number");
    const cart = await createCart();
    const cartId = cart.id;
    (await cookies()).set("cartId", cartId, { httpOnly: true, secure: false });
    await getCart();
    return {
      error: false,
      success: true,
    };
  } catch (e) {
    return {
      error: true,
      success: false,
    };
  }
}
