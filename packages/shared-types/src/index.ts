// ============================================================
// Eastern Gist - Shared Types
// ============================================================
// This package contains types shared between frontend and backend.
// These mirror the Prisma schema but are framework-agnostic.

// ============================================================
// Enums
// ============================================================

export enum ModerationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  FLAGGED = 'flagged',
  REMOVED = 'removed',
}

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator',
}

export enum PostType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  GIF = 'gif',
  POLL = 'poll',
  DOCUMENT = 'document',
}

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  HAHA = 'haha',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
  FIRE = 'fire',
  CLAP = 'clap',
}

export enum ProductCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
  REFUNDED = 'refunded',
}

export enum TransactionStatus {
  INITIATED = 'initiated',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentProvider {
  PAYSTACK = 'paystack',
  FLUTTERWAVE = 'flutterwave',
}

export enum CompetitionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  VOTING = 'voting',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow',
  MENTION = 'mention',
  VOTE = 'vote',
  MESSAGE = 'message',
  MATCH = 'match',
  OFFER = 'offer',
  PRICE_DROP = 'price_drop',
  NEW_CONFESSION = 'new_confession',
  PROFILE_VIEW = 'profile_view',
  SHARE = 'share',
  REPLY = 'reply',
  ACHIEVEMENT = 'achievement',
  STREAK = 'streak',
  LEVEL_UP = 'level_up',
  BADGE = 'badge',
  COMPETITION = 'competition',
  REFERRAL = 'referral',
  SYSTEM = 'system',
}

export enum ReportReason {
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  HATE_SPEECH = 'hate_speech',
  NUDITY = 'nudity',
  VIOLENCE = 'violence',
  FALSE_INFORMATION = 'false_information',
  COPYRIGHT = 'copyright',
  OTHER = 'other',
}

export enum ReportTargetType {
  POST = 'post',
  COMMENT = 'comment',
  USER = 'user',
  PRODUCT = 'product',
  MESSAGE = 'message',
  CONFESSION = 'confession',
  STORY = 'story',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum LoveLanguage {
  WORDS_OF_AFFIRMATION = 'words_of_affirmation',
  QUALITY_TIME = 'quality_time',
  RECEIVING_GIFTS = 'receiving_gifts',
  ACTS_OF_SERVICE = 'acts_of_service',
  PHYSICAL_TOUCH = 'physical_touch',
}

export enum SwipeDirection {
  LEFT = 'left',
  RIGHT = 'right',
  SUPER_LIKE = 'super_like',
}

export enum MatchStatus {
  PENDING = 'pending',
  MATCHED = 'matched',
  UNMATCHED = 'unmatched',
  BLOCKED = 'blocked',
}

export enum AdStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  REJECTED = 'rejected',
}

export enum AdPlacement {
  FEED = 'feed',
  STORIES = 'stories',
  SIDEBAR = 'sidebar',
  MARKETPLACE = 'marketplace',
  SEARCH = 'search',
}

export enum EventVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FACULTY_ONLY = 'faculty_only',
  DEPARTMENT_ONLY = 'department_only',
  HOSTEL_ONLY = 'hostel_only',
}

export enum GroupPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SECRET = 'secret',
}

export enum MembershipStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BANNED = 'banned',
  LEFT = 'left',
}

export enum ActivityAction {
  CREATED_POST = 'created_post',
  LIKED_POST = 'liked_post',
  COMMENTED = 'commented',
  SHARED_POST = 'shared_post',
  FOLLOWED_USER = 'followed_user',
  JOINED_GROUP = 'joined_group',
  CREATED_PRODUCT = 'created_product',
  PURCHASED = 'purchased',
  VOTED = 'voted',
  ENTERED_COMPETITION = 'entered_competition',
  WON_COMPETITION = 'won_competition',
  EARNED_BADGE = 'earned_badge',
  LEVELED_UP = 'leveled_up',
  MATCHED = 'matched',
  SENT_MESSAGE = 'sent_message',
  REFERRED_USER = 'referred_user',
  COMPLETED_MISSION = 'completed_mission',
}

// ============================================================
// Entity Types
// ============================================================

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  phone?: string | null;
  phoneVerified: boolean;
  role: UserRole;
  isStudentVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  profile?: Profile | null;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  facultyId?: string | null;
  departmentId?: string | null;
  universityId?: string | null;
  hostelId?: string | null;
  academicLevel?: number | null;
  interests: string[];
  loveLanguage?: LoveLanguage | null;
  lookingFor?: string | null;
  voiceIntroUrl?: string | null;
  xp: number;
  level: number;
  streak: number;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
  university?: University | null;
  faculty?: Faculty | null;
  department?: Department | null;
  hostel?: Hostel | null;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  domain: string;
  city: string;
  state: string;
  logoUrl?: string | null;
  createdAt: string;
  faculties?: Faculty[];
}

export interface Faculty {
  id: string;
  name: string;
  universityId: string;
  university?: University;
  departments?: Department[];
}

export interface Department {
  id: string;
  name: string;
  facultyId: string;
  faculty?: Faculty;
}

export interface Hostel {
  id: string;
  name: string;
  universityId: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  university?: University;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  department?: Department;
}

export interface Post {
  id: string;
  authorId: string;
  type: PostType;
  content: string;
  mediaUrls: string[];
  category?: string | null;
  isAnonymous: boolean;
  isConfession: boolean;
  tags: string[];
  hashtags: string[];
  mentionIds: string[];
  pollId?: string | null;
  moderationStatus: ModerationStatus;
  viewCount: number;
  shareCount: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  author?: Profile | null;
  reactions?: Reaction[];
  comments?: Comment[];
  _count?: { reactions: number; comments: number };
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  parentId?: string | null;
  content: string;
  mediaUrl?: string | null;
  moderationStatus: ModerationStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  author?: Profile | null;
  replies?: Comment[];
  reactions?: Reaction[];
  _count?: { reactions: number; replies: number };
}

export interface Reaction {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
  type: ReactionType;
  createdAt: string;
  user?: Profile | null;
}

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
  post?: Post;
}

export interface Story {
  id: string;
  authorId: string;
  mediaUrl: string;
  caption?: string | null;
  expiresAt: string;
  createdAt: string;
  deletedAt?: string | null;
  author?: Profile | null;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  condition: ProductCondition;
  category: string;
  images: string[];
  videoUrl?: string | null;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isSold: boolean;
  isBoosted: boolean;
  moderationStatus: ModerationStatus;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  seller?: Profile | null;
  priceHistory?: PriceHistory[];
  _count?: { wishlists: number };
}

export interface PriceHistory {
  id: string;
  productId: string;
  price: number;
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  productId: string;
  sellerId: string;
  status: OrderStatus;
  amount: number;
  escrowReleased: boolean;
  createdAt: string;
  updatedAt: string;
  buyer?: Profile;
  product?: Product;
  seller?: Profile;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product?: Product;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessageAt?: string | null;
  createdAt: string;
  messages?: Message[];
  participantProfiles?: Profile[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  mediaUrl?: string | null;
  isRead: boolean;
  isOffer: boolean;
  offerAmount?: number | null;
  offerStatus?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  sender?: Profile;
}

export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  status: MatchStatus;
  compatibilityScore?: number | null;
  createdAt: string;
  updatedAt: string;
  user1?: Profile;
  user2?: Profile;
}

export interface Swipe {
  id: string;
  swiperId: string;
  swipedId: string;
  direction: SwipeDirection;
  createdAt: string;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  type: string;
  coverUrl?: string | null;
  status: CompetitionStatus;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
  entries?: CompetitionEntry[];
  _count?: { entries: number; votes: number };
}

export interface CompetitionEntry {
  id: string;
  competitionId: string;
  userId: string;
  caption?: string | null;
  mediaUrl?: string | null;
  voteCount: number;
  createdAt: string;
  user?: Profile;
  competition?: Competition;
}

export interface Vote {
  id: string;
  userId: string;
  entryId: string;
  competitionId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string | null;
  status: ModerationStatus;
  createdAt: string;
  updatedAt: string;
  reporter?: Profile;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  xpReward: number;
  criteria: Record<string, unknown>;
  createdAt: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  badge?: Badge;
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  xpAwarded: number;
  createdAt: string;
}

export interface XpTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  reference?: string | null;
  createdAt: string;
}

export interface Streak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  provider: PaymentProvider;
  reference: string;
  purpose: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Ad {
  id: string;
  userId: string;
  title: string;
  description: string;
  mediaUrl: string;
  linkUrl?: string | null;
  placement: AdPlacement;
  status: AdStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  coverUrl?: string | null;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  startsAt: string;
  endsAt: string;
  visibility: EventVisibility;
  maxAttendees?: number | null;
  createdAt: string;
  updatedAt: string;
  organizer?: Profile;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  coverUrl?: string | null;
  privacy: GroupPrivacy;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: Profile;
  members?: GroupMember[];
  _count?: { members: number };
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: string;
  status: MembershipStatus;
  joinedAt: string;
  user?: Profile;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  xpAwarded: number;
  createdAt: string;
  referrer?: Profile;
  referred?: Profile;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: ActivityAction;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface Hashtag {
  id: string;
  tag: string;
  postCount: number;
  createdAt: string;
}

export interface Mention {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
  createdAt: string;
}

// ============================================================
// API Request/Response Types
// ============================================================

export interface PaginatedResponse<T> {
  data: T[];
  cursor: string | null;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  username: string;
  universityId: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface CreatePostRequest {
  type: PostType;
  content: string;
  mediaUrls?: string[];
  category?: string;
  isAnonymous?: boolean;
  isConfession?: boolean;
  tags?: string[];
  hashtags?: string[];
  mentionIds?: string[];
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  condition: ProductCondition;
  category: string;
  images: string[];
  videoUrl?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateCompetitionRequest {
  title: string;
  description: string;
  type: string;
  coverUrl?: string;
  startsAt: string;
  endsAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  coverUrl?: string;
  privacy: GroupPrivacy;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  coverUrl?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  startsAt: string;
  endsAt: string;
  visibility: EventVisibility;
  maxAttendees?: number;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  gender?: Gender;
  dateOfBirth?: string;
  facultyId?: string;
  departmentId?: string;
  hostelId?: string;
  level?: number;
  interests?: string[];
  loveLanguage?: LoveLanguage;
  lookingFor?: string;
}

export interface SwipeRequest {
  swipedId: string;
  direction: SwipeDirection;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  mediaUrl?: string;
  isOffer?: boolean;
  offerAmount?: number;
}

export interface CreateReportRequest {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
}

// ============================================================
// Socket.io Event Types
// ============================================================

export interface SocketEvents {
  // Chat events
  'chat:message': { chatId: string; message: Message };
  'chat:typing': { chatId: string; userId: string; isTyping: boolean };
  'chat:read': { chatId: string; userId: string; messageId: string };

  // Notification events
  'notification:new': Notification;

  // Presence events
  'presence:online': { userId: string };
  'presence:offline': { userId: string };

  // Feed events
  'feed:new_post': Post;
  'feed:trending_update': { category: string; posts: Post[] };

  // Competition events
  'competition:vote_update': { competitionId: string; entryId: string; voteCount: number };

  // Matchmaking events
  'match:new': Match;
  'match:crush_reveal': { userId: string; matchedUserId: string };
}