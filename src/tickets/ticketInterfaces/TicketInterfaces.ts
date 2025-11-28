export interface FileAttachment {
  path: string;
  id?: string | null;
  name?: string | null;
}

export interface TicketDetails {
  id: number;
  ticket_id: string;
  ticket_name: string;
  summary: string;
  description: string;
  comment: string;

  assignee_id: string | null;
  reporter_id: string | null;
  board_id: string;
  project_id: string;
  milestone_id: string;
  parent_ticket_id: string;
  entity_id: string | null;

  file_attachment: string[];

  file_attachment_id: string | null;
  file_attachment_name: string | null;

  merge_status: boolean;

  start_date: string | null;
  end_date: string | null;
  due_date: string | null;

  created_at: string;
  updated_at: string;

  estimated_hours: number | null;
  total_hours_spent: number | null;

  status_id: string;
  ticket_severity: string;
  ticket_state: string;
  ticket_status: string;

  workflow_id: string;
}

export interface TicketHistoryUpdateType {
  ticket_id: string;
  changed_by: string;
  field_name: string;
  old_value: string;
  new_value: string;
}

export interface TicketHistoryDetailsType {
  ticket_id: string;
  changed_by: string;
  field_name: string;
  old_value: string;
  new_value: string;
  id: string;
  created_at: string;
  updated_at: string;
  entity_id: any;
}

export interface UsersDataType {
  phone_number: string;
  role: string;
  id: number;
  updated_at: string;
  email: string;
  last_name: string;
  first_name: string;
  password_hash: string;
  is_active: boolean;
  created_at: string;
  entity_id: any;
}

export interface TicketCollaboratorsDataType {
  id: number;
  created_at: string;
  updated_at: string;
  entity_id: string;
  ticket_id: number;
  user_id: number;
}
