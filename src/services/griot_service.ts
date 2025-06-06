import { useAuthStore } from '@/composables/user'

const authStore = useAuthStore();
const storeUser = authStore.getUser;

import { handleResponse } from "@/utilities/UtilityFunction";
/**
 * Author: Styves
 * this javaScript file contains all the functions used to communicate with database(community).
 * date: 05/10/2023
 */
const uriUser = import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "users";
const uriCourse = import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "courses";
const uriSection = import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "sections";
const uriLecture = import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "lectures";
const uriEnrollments =
    import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "enrollments";
const uriReview = import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "reviews";
const uriPractice =
    import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "practices";
const uriQuestion =
    import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "questions";
const uriPracticePlay =
    import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "practicePlays";
const uriInstructors =
    import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "instructors";
const uriStudents =
    import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "students";
const uriChats = import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "chats";
const uriMessages =
    import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "messages";
const uriNotice = import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "notices";
const uriPayout = import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "payout_methods";
const uriRoles = import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "roles";
const uriStat = "statistic";
const uriPromotions = import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + 'promotions'
const cartPriceUri = `${import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE}payments`;

/** this function is used to get the current user information from database*/
export const getUser = (userId:string) => {
    return fetch(`${uriUser}/${userId}`);
};
export const getUsers = (pageNumber:number, pageSize:number) => {
    return fetch(`${uriUser}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};
/** this function is used to delete question in databases*/
export const deleteUserDb = (id:string) => {
    return fetch(`${uriUser}/${id}`, {
        method: "DELETE",
    });
};
export const getInstructorsTop = (category:string, subCategory:string, topic:string) => {
    return fetch(`${uriUser}/instructors?category=${category}&subCategory=${subCategory}&topic=${topic}`);
}
export const getUserByRoles = (roleId:string, word:string, pageNumber:number, pageSize:number) => {
    return fetch(`${uriUser}/roles?roleId=${roleId}&word=${word}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
}
export const getUserMonthStat = (id:string, pageNumber:number,
    pageSize:number,
) => {
    return fetch(
        `${uriUser}/${id}/stat?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
};
/** this function is used to create user */
export const createUsers = (users:any) => {
    return fetch(`${uriUser}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(users),
    });
};
/** this function is used to create user */
export const convertGuestToUser = async (request:any) => {
    const response = await fetch(`${uriUser}/guest_user`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
    return handleResponse(response);
};
export const updateWishList = (id:string, courseId:string, action:string) => {
    return fetch(
        `${uriUser}/${id}/wishList?courseId=${courseId}&action=${action}`,
        {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }
    );
};
export const updateProfileInformation = (id:string, request:any) => {
    return fetch(`${uriUser}/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};

/** this function is used to create nes courses in databases*/
export const createCourses = (courses:any) => {
    return fetch(`${uriCourse}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(courses),
    });
};
export const coursesIntendedLearners = (id:string,request:any) => {
    return fetch(`${uriCourse}/${id}/intendedLearners`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
export const coursesLandingPage = (id:string,request:any) => {
    return fetch(`${uriCourse}/${id}/setLandingPage`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
export const coursesStep = (id:string,request:any) => {
    return fetch(`${uriCourse}/${id}/step?step=${request}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
};
export const coursesMessage = (id:string,request:any) => {
    return fetch(`${uriCourse}/${id}/setMessage`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
export const coursesPricing = (id:string,request:any) => {
    return fetch(`${uriCourse}/${id}/setPricing`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
export const submitCourse = (id:string) => {
    return fetch(`${uriCourse}/${id}/submit`, {
        method: "POST",
    });
};
export const publishCourse = (id:string,request:any) => {
    return fetch(`${uriCourse}/${id}/publish`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
export const refuseCourse = (id:string,request:any) => {
    return fetch(`${uriCourse}/${id}/reject`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
/** this courses is used to getCourse by userId*/
export const getCourseByInstructorId = (
    id:string,
    word:string,
    pageNumber:number,
    pageSize:number,
    sortBy:string
) => {
    return fetch(
        `${uriUser}/${id}/courses?word=${word}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}`
    );
};
export const getCourseById = (courseId:string, section:any) => {
    return fetch(`${uriCourse}/${courseId}?section=${section}`);
};
export const getCourseByIdPreview = (courseId:string, section:any) => {
    const currency = (storeUser.user && storeUser.user.currencyCode) ? storeUser.user.currencyCode : 'eur';

    return fetch(`${uriCourse}/${courseId}/preview?section=${section}&currency=${currency}`);
};
export const updateCourse = (id:string, course:any) => {
    return fetch(`${uriCourse}/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
    });
};
export const courseCheckEnrollment = (courseId:string, userId:string) => {
    return fetch(`${uriCourse}/${courseId}/checkEnrollment?userId=${userId}`);
};
/** this function is used to create nes courses in databases*/
export const createSections = (sections:any) => {
    return fetch(`${uriSection}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sections),
    });
};
/** this function is used to update sections in databases*/
export const updateSection = (id:string, section:any) => {
    return fetch(`${uriSection}/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(section),
    });
};
/** this function is used to delete sections in databases*/
export const deleteSection = (id:string) => {
    return fetch(`${uriSection}/${id}`, {
        method: "DELETE",
    });
};

/** this function is used to create new Lectures in databases*/
export const createLectures = (lectures:any) => {
    return fetch(`${uriLecture}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(lectures),
    });
};
/** this function is used to update Lectures in databases*/
export const updateLecture = (id:string, lecture:any) => {
    return fetch(`${uriLecture}/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(lecture),
    });
};
/** this function is used to delete Lectures in databases*/
export const deleteLecture = (id:string) => {
    return fetch(`${uriLecture}/${id}`, {
        method: "DELETE",
    });
};
/** this function is used to add resources to
 * Lectures in databases*/
export const AddResources = (id:string, resources:any) => {
    return fetch(`${uriLecture}/${id}/resources`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(resources),
    });
};

/** this function is used to add new Questions to
 * Lectures in databases*/
export const AddQuestions = (id:string, courseId:string, questions:any) => {
    return fetch(`${uriLecture}/${id}/questions?courseId=${courseId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(questions),
    });
};
/** this function is used to get Lectures in databases*/
export const deleteResources = (id:string, resourceId:string) => {
    return fetch(`${uriLecture}/${id}/resources/${resourceId}`, {
        method: "DELETE",
    });
};
export const getLecture = (id:string) => {
    return fetch(`${uriLecture}/${id}`, {
        method: "GET",
    });
};

export const getAllCourses = (pageNumber:number, pageSize:number) => {
    return fetch(`${uriCourse}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};
export const findCourses = (
    instructorId:string,
    word:string,
    category:string,
    subCategory:string,
    type:string,
    status:string,
    sortBy:string,
    pageNumber:number,
    pageSize:number
) => {
    const currency = (storeUser.user && storeUser.user.currencyCode) ? storeUser.user.currencyCode : 'eur';
    const userId = storeUser.user ? storeUser.user.id : ''
    return fetch(
        `${uriCourse}/search?instructorId=${instructorId}&word=${word}&category=${category}&subCategory=${subCategory}&status=${status}&sortBy=${sortBy}&pageNumber=${pageNumber}&pageSize=${pageSize}&currency=${currency}&userId=${userId}`
    );
}
export const searchAutoCompleted = (
    word:string,
) => {
    return fetch(
        `${uriCourse}/search_autocompleted?word=${word}`
    );
}
export const findCoursesCategory = (
    word:string,
    category:string,
    subCategory:string,
    type:string,
    status:string,
    topic:string,
    pageNumber:number,
    pageSize:number
) => {
    const currency = (storeUser.user && storeUser.user.currencyCode) ? storeUser.user.currencyCode : 'eur';
    const userId = storeUser.user ? storeUser.user.id : ''
    return fetch(
        `${uriCourse}/search_category?word=${word}&category=${category}&subCategory=${subCategory}&status=${status}&type=${type}&topic=${topic}&pageNumber=${pageNumber}&pageSize=${pageSize}&currency=${currency}&userId=${userId}`
    );
};
export const searchCourses = (
    word:string,
    category:string,
    subCategory:string,
    type:string,
    status:string,
    topic:string,
    pageNumber:number,
    pageSize:number
) => {
    const currency = (storeUser.user && storeUser.user.currencyCode) ? storeUser.user.currencyCode : 'eur';
    const userId = storeUser.user ? storeUser.user.id : ''
    return fetch(
        `${uriCourse}/search_filter?word=${word}&category=${category}&subCategory=${subCategory}&status=${status}&type=${type}&topic=${topic}&pageNumber=${pageNumber}&pageSize=${pageSize}&currency=${currency}&userId=${userId}`
    );
};
/** this function is used to get Lectures in databases*/
export const deleteCourse = (id:string) => {
    return fetch(`${uriCourse}/${id}`, {
        method: "DELETE",
    });
};

/** product catalog management section
 *
 * **/

/** this function is used to add product to user cart **/
export const appProducts = (id:string,request:any) => {
    return fetch(`${uriUser}/${id}/addProduct`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
export const removeProducts = (id:string,request:any) => {
    return fetch(`${uriUser}/${id}/removeProduct`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};

/** Enrollment  management section
 *
 * **/

export const createEnrollments = (request:any) => {
    return fetch(`${uriEnrollments}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
export const completeEnrollment = (request:any) => {
    return fetch(`${uriEnrollments}/completed`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
export const getEnrollmentsByInstructor = ( userId:string)=>{
 return fetch(`${uriEnrollments}/instructor/${userId}`, {
        method: "GET",
    });
}
/** manage course progression**/
export const getCoursesProgression = (id:string, type:string) => {
    return fetch(`${uriUser}/${id}/coursesProgression?type=${type}`, {
        method: "GET",
    });
};
export const getCoursesProgressionById = (id:string, courseProgressionId:string, action:string) => {
    return fetch(`${uriUser}/${id}/coursesProgression/${courseProgressionId}?action=${action}`, {
        method: "GET",
    });
};
export const getCourseProgressionByCourseId = (id:string, courseId:string) => {
    return fetch(`${uriUser}/${id}/coursesProgressions?courseId=${courseId}`, {
        method: "GET",
    });
};

export const updateProgression = (id:string,request:any) => {
    return fetch(`${uriUser}/${id}/updateProgression`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
export const updateFavorites = (id:string, courseId:string, isFavorite:boolean) => {
    return fetch(
        `${uriUser}/${id}/courses/${courseId}/favorites?isFavorite=${isFavorite}`,
        {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }
    );
};
export const updateArchived = (id:string, courseId:string, isArchived:boolean) => {
    return fetch(
        `${uriUser}/${id}/courses/${courseId}/archived?isArchived=${isArchived}`,
        {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }
    );
};
/** manage reviews*/
export const createReviews = (request:any) => {
    return fetch(`${uriReview}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};

/*** this section is used to manage information about practice test and questions
 * @author Styves Amougou
 * @date 16-10-2023
 * ***/

/** this function is used to create new Practices in databases*/
export const createPractices = (practices:any) => {
    return fetch(`${uriPractice}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(practices),
    });
};
/** this function is used to update practices in databases*/
export const updatePractice = (id:string, practice:Record<string, any>) => {
    return fetch(`${uriPractice}/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(practice),
    });
};
/** this function is used to delete practices in databases*/
export const deletePractice = (id:string) => {
    return fetch(`${uriPractice}/${id}`, {
        method: "DELETE",
    });
};

export const getPracticeTestById = async (id:string) => {
    const response = await fetch(`${uriPractice}/${id}`, {
        method: "GET",
    });
    return handleResponse(response);
};
/** this function is used to create new question in databases*/
export const createQuestions = (questions:any) => {
    return fetch(`${uriQuestion}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(questions),
    });
};
/** this function is used to update questions in databases*/
export const updateQuestion = (id:string, question:any) => {
    return fetch(`${uriQuestion}/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(question),
    });
};
/** this function is used to delete question in databases*/
export const deleteQuestion = (id:string) => {
    return fetch(`${uriQuestion}/${id}`, {
        method: "DELETE",
    });
};

/** this function is used to create nes courses in databases*/
export const upsertPlay = (request:any) => {
    return fetch(`${uriPracticePlay}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};

/*** this section is used to manage information about Instructor
 * @author Styves Amougou
 * @date 18-10-2023
 * ***/
export const getInstructorCourses = (id:string) => {
    return fetch(`${uriInstructors}/${id}/courses`, {
        method: "GET",
    });
};
export const getStudents = (courseIds:any) => {
    return fetch(`${uriStudents}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(courseIds),
    });
};

export const getReviews = (
    courseIds:any,
    hasComment:boolean,
    hasResponse:boolean,
    sortBy:string,
    rating:number,
    pageNumber:number,
    pageSize:number
) => {
    return fetch(
        `${uriCourse}/reviews?hasComment=${hasComment}&hasResponse=${hasResponse}&sortBy=${sortBy}&rating=${rating}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(courseIds),
        }
    );
};
export const reviewReply = (id:string,request:any) => {
    return fetch(`${uriReview}/${id}/reply`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};

/*** this section is used to manage information about Message
 * @author Styves Amougou
 * @date 20-10-2023
 * ***/

export const getChats = (id:string, status:string, sortBy:string) => {
    return fetch(`${uriUser}/${id}/chats?status=${status}&sortBy=${sortBy}`, {
        method: "GET",
    });
};
export const getMessages = (chatId:string, pageNumber:number, pageSize:number) => {
    return fetch(
        `${uriChats}/${chatId}/messages?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
            method: "GET",
        }
    );
};
export const getReadMessage = (chatId:string) => {
    return fetch(`${uriChats}/${chatId}/read`, {
        method: "PUT",
    });
};
export const postMessage = (message:any) => {
    return fetch(`${uriMessages}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });
};

/*** this section is used to promotions information about courses
 * @author Styves Amougou
 * @date 27-10-2023
 * ***/
export const getAllPromotions = (pageNumber:number, pageSize:number) => {
    return fetch(`${uriPromotions}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        method: "GET",
    });
};
export const getPromotions = (id:string) => {
    return fetch(`${uriCourse}/${id}/promotions`, {
        method: "GET",
    });
};
export const createPromotions = (id:string,request:any) => {
    return fetch(`${uriCourse}/${id}/promotions`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
export const UpdatePromotion = (id:string, prId:string,request:any) => {
    return fetch(`${uriCourse}/${id}/promotions/${prId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
export const deletePromotion = (id:string, prId:string) => {
    return fetch(`${uriCourse}/${id}/promotions/${prId}`, {
        method: "DELETE",
    });
};
/*** this section is used to Notification information about courses
 * @author Styves Amougou
 * @date 28-10-2023
 * ***/
export const getNotification = (id:string) => {
    return fetch(`${uriNotice}?userId=${id}`, {
        method: "GET",
    });
};

/****/
/** this function is used to create user */
export const createPayoutMethod = (request:any) => {
    return fetch(`${uriPayout}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};
/** this function is used to get the current user information from database*/
export const getUserPayoutMethod = (userId:string) => {
    return fetch(`${uriPayout}/${userId}`);
};
/** this function is used to get the current user information from database*/
export const getAllRoles = () => {
    return fetch(`${uriRoles}`);
};

/** this function is used to get the current stat from database*/
export const getAllStat = () => {
    return fetch(`${uriStat}`);
};

export const calculateWebCartPrice = async (cart:any) => {
    const response = await fetch(`${cartPriceUri}/charge/price?webcart=${cart.webcart}&user=${cart.user}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
    });
    return handleResponse(response);
};
export const completeChargeCinetPay = async (request:any) => {
    const response = await fetch(`${cartPriceUri}/chargeCinetPay`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(request),
    });
    return handleResponse(response);
}
