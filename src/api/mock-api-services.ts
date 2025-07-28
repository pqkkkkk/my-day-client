import {
  CreateListRequest,
  ListFilterObject,
  RefreshTokenRequest,
  SignInRequest,
  SignUpRequest,
} from "@/types/api-request-body";
import {
  ApiResponse,
  RefreshTokenResponse,
  SignInResponse,
} from "@/types/api-response";
import { List, Page, User } from "@/types";

export const authService = {
  signIn: async (
    request: SignInRequest
  ): Promise<ApiResponse<SignInResponse>> => {
    const response : ApiResponse<SignInResponse> = {
        statusCode: 200,
        success: true,
        message: "Sign in successful",
        data: {
            accessToken: "mockAccessToken",
            refreshToken: "mockRefreshToken",
            user: {
                username: "mockUser",
                userPassword: "mockUserPassword",
                userEmail: "mockUserEmail",
                userFullName: "Mock User",
            },
            authenticated: true,
        }
    }

    return response;
  },
  signUp: async (request: SignUpRequest): Promise<ApiResponse<User>> => {
    const response: ApiResponse<User> = {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: {
        username: request.username,
        userPassword: request.userPassword,
        userEmail: request.userEmail,
        userFullName: request.userFullName,
      },
    };
    return response;
  },
  refreshToken: async (
    request: RefreshTokenRequest
  ): Promise<ApiResponse<RefreshTokenResponse>> => {
    const response: ApiResponse<RefreshTokenResponse> = {
      statusCode: 200,
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      },
    };
    return response;
  },
};

export const listService = {
  createList: async (
    request: CreateListRequest
  ): Promise<ApiResponse<List>> => {

    const mockList: List = {
      listId: `list-${Date.now()}`,
      listTitle: "New List",
      listDescription: "Description of the new list",
      listCategory: "PERSONAL",
      color: "#f0f0f0",
      username: "pqkiet854",
      completedTasksCount: 0,
      totalTasksCount: 0,
      progressPercentage: 0,
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response: ApiResponse<List> = {
      statusCode: 201,
      success: true,
      message: "List created successfully",
      data: mockList,
    };

    return response;
  },
  getLists: async ( filter: ListFilterObject ): Promise<ApiResponse<Page<List>>> => {
    const mockLists: List[] = [
      {
        listId: "list1",
        listTitle: "Web Development Project",
        listDescription: "Frontend redesign and new features implementation",
        listCategory: "WORK",
        color: "#3B82F6", // Blue
        username: "pqkiet854",
        completedTasksCount: 1,
        totalTasksCount: 4,
        progressPercentage: 25,
        tasks: [
          {
            taskId: "l1-t1",
            taskTitle: "Create responsive navigation",
            taskDescription: "Design and implement mobile-first navigation",
            deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            taskStatus: "IN_PROGRESS",
            taskPriority: "HIGH",
            listId: "list1",
            steps: [
              {
                stepId: "l1-t1-s1",
                stepTitle: "Design mockup",
                completed: true,
                createdAt: new Date(),
              },
              {
                stepId: "l1-t1-s2",
                stepTitle: "Code HTML structure",
                completed: true,
                createdAt: new Date(),
              },
              {
                stepId: "l1-t1-s3",
                stepTitle: "Add CSS styling",
                completed: false,
                createdAt: new Date(),
              },
              {
                stepId: "l1-t1-s4",
                stepTitle: "Add JavaScript interactions",
                completed: false,
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            taskId: "l1-t2",
            taskTitle: "Implement user authentication",
            taskDescription: "Add login and registration functionality",
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            taskStatus: "TODO",
            taskPriority: "HIGH",
            listId: "list1",
            steps: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            taskId: "l1-t3",
            taskTitle: "Set up database schema",
            taskDescription: "Design and implement database structure",
            taskStatus: "COMPLETED",
            taskPriority: "MEDIUM",
            listId: "list1",
            steps: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        listId: "list2",
        listTitle: "Marketing Campaign",
        listDescription: "Q3 marketing campaign planning and execution",
        listCategory: "WORK",
        color: "#10B981", // Green
        username: "pqkiet854",
        completedTasksCount: 0,
        totalTasksCount: 2,
        progressPercentage: 0,
        tasks: [
          {
            taskId: "l2-t1",
            taskTitle: "Create social media content",
            taskDescription:
              "Design posts for Instagram, Twitter, and LinkedIn",
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            taskStatus: "TODO",
            taskPriority: "MEDIUM",
            listId: "list2",
            steps: [
              {
                stepId: "l2-t1-s1",
                stepTitle: "Brainstorm content ideas",
                completed: true,
                createdAt: new Date(),
              },
              {
                stepId: "l2-t1-s2",
                stepTitle: "Create graphics",
                completed: false,
                createdAt: new Date(),
              },
              {
                stepId: "l2-t1-s3",
                stepTitle: "Write captions",
                completed: false,
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            taskId: "l2-t2",
            taskTitle: "Plan email campaign",
            taskDescription: "Design and schedule email marketing sequence",
            deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            taskStatus: "IN_PROGRESS",
            taskPriority: "MEDIUM",
            listId: "list2",
            steps: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        listId: "list3",
        listTitle: "Learning Goals",
        listCategory: "PERSONAL",
        listDescription: "Personal development and skill improvement",
        color: "#8B5CF6", // Purple
        username: "pqkiet854",
        completedTasksCount: 0,
        totalTasksCount: 1,
        progressPercentage: 0,
        tasks: [
          {
            taskId: "l3-t1",
            taskTitle: "Complete React course",
            taskDescription: "Finish advanced React patterns course",
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            taskStatus: "IN_PROGRESS",
            taskPriority: "LOW",
            listId: "list3",
            steps: [
              {
                stepId: "l3-t1-s1",
                stepTitle: "Watch video lectures",
                completed: true,
                createdAt: new Date(),
              },
              {
                stepId: "l3-t1-s2",
                stepTitle: "Complete exercises",
                completed: false,
                createdAt: new Date(),
              },
              {
                stepId: "l3-t1-s3",
                stepTitle: "Build final project",
                completed: false,
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const response : ApiResponse<Page<List>> = {
      statusCode: 200,
        success: true,
        message: "Lists retrieved successfully",
        data: {
            content: mockLists,
            totalElements: mockLists.length,
            totalPages: 1,
            size: mockLists.length,
            number: 0,
            last: true,
            first: true,
            sort: {
                sorted: true,
                unsorted: false,
                empty: false,
            },
            numberOfElements: mockLists.length,
            empty: false,
            pageable: {
                pageNumber: 0,
                pageSize: mockLists.length,
                sort: {
                    sorted: true,
                    unsorted: false,
                    empty: false,
                },
                offset: 0,
                paged: true,
                unpaged: false,
            }
        }
    };
    return response;
  },
  deleteList: async (listId: string) => {
    const response = true;

    return response;
  },
};

export const taskService = {}
