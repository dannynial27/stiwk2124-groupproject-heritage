import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';

export interface ProductAlert {
  id?: string;
  productId: number;
  userId?: string;
  alertType: 'stock' | 'price' | 'back_in_stock' | 'new_review';
  targetValue?: number; // For price alerts
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  productId?: number;
  imageUrl?: string;
  actionText?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationSettings {
  enableBrowserNotifications: boolean;
  enableEmailNotifications: boolean;
  enableStockAlerts: boolean;
  enablePriceAlerts: boolean;
  enableReviewAlerts: boolean;
  alertFrequency: 'immediate' | 'daily' | 'weekly';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/qurba/api/notifications';
  
  // State management
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private alertsSubject = new BehaviorSubject<ProductAlert[]>([]);
  
  // Public observables
  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();
  public alerts$ = this.alertsSubject.asObservable();
  
  // Real-time notifications
  private newNotificationSubject = new Subject<Notification>();
  public newNotification$ = this.newNotificationSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeService();
  }

  // Initialization
  private initializeService() {
    this.loadNotifications();
    this.loadProductAlerts();
    this.checkBrowserNotificationPermission();
    
    // Set up periodic checks for alerts
    setInterval(() => {
      this.checkActiveAlerts();
    }, 60000); // Check every minute
  }

  // === NOTIFICATIONS MANAGEMENT ===

  /**
   * Load user's notifications
   */
  loadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user`).pipe(
      map(notifications => {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
        return notifications;
      }),
      catchError(error => {
        console.error('Error loading notifications:', error);
        return [];
      })
    );
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      map(response => {
        const notifications = this.notificationsSubject.value;
        const updatedNotifications = notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        this.notificationsSubject.next(updatedNotifications);
        this.updateUnreadCount(updatedNotifications);
        return response;
      }),
      catchError(error => {
        console.error('Error marking notification as read:', error);
        throw error;
      })
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/mark-all-read`, {}).pipe(
      map(response => {
        const notifications = this.notificationsSubject.value;
        const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
        this.notificationsSubject.next(updatedNotifications);
        this.unreadCountSubject.next(0);
        return response;
      }),
      catchError(error => {
        console.error('Error marking all notifications as read:', error);
        throw error;
      })
    );
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${notificationId}`).pipe(
      map(response => {
        const notifications = this.notificationsSubject.value;
        const updatedNotifications = notifications.filter(n => n.id !== notificationId);
        this.notificationsSubject.next(updatedNotifications);
        this.updateUnreadCount(updatedNotifications);
        return response;
      }),
      catchError(error => {
        console.error('Error deleting notification:', error);
        throw error;
      })
    );
  }

  /**
   * Clear old notifications
   */
  clearOldNotifications(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear-old`).pipe(
      map(response => {
        this.loadNotifications().subscribe();
        return response;
      }),
      catchError(error => {
        console.error('Error clearing old notifications:', error);
        throw error;
      })
    );
  }

  // === PRODUCT ALERTS MANAGEMENT ===

  /**
   * Load user's product alerts
   */
  loadProductAlerts(): Observable<ProductAlert[]> {
    return this.http.get<ProductAlert[]>(`${this.apiUrl}/alerts`).pipe(
      map(alerts => {
        this.alertsSubject.next(alerts);
        return alerts;
      }),
      catchError(error => {
        console.error('Error loading product alerts:', error);
        return [];
      })
    );
  }

  /**
   * Create stock alert (notify when item is back in stock)
   */
  createStockAlert(productId: number): Observable<ProductAlert> {
    const alert: Partial<ProductAlert> = {
      productId,
      alertType: 'back_in_stock',
      isActive: true,
      createdAt: new Date()
    };

    return this.http.post<ProductAlert>(`${this.apiUrl}/alerts`, alert).pipe(
      map(newAlert => {
        const alerts = this.alertsSubject.value;
        this.alertsSubject.next([...alerts, newAlert]);
        this.showLocalNotification('Stock Alert Created', `You'll be notified when this product is back in stock`);
        return newAlert;
      }),
      catchError(error => {
        console.error('Error creating stock alert:', error);
        throw error;
      })
    );
  }

  /**
   * Create price drop alert
   */
  createPriceAlert(productId: number, targetPrice: number): Observable<ProductAlert> {
    const alert: Partial<ProductAlert> = {
      productId,
      alertType: 'price',
      targetValue: targetPrice,
      isActive: true,
      createdAt: new Date()
    };

    return this.http.post<ProductAlert>(`${this.apiUrl}/alerts`, alert).pipe(
      map(newAlert => {
        const alerts = this.alertsSubject.value;
        this.alertsSubject.next([...alerts, newAlert]);
        this.showLocalNotification('Price Alert Created', `You'll be notified when price drops to RM${targetPrice.toFixed(2)}`);
        return newAlert;
      }),
      catchError(error => {
        console.error('Error creating price alert:', error);
        throw error;
      })
    );
  }

  /**
   * Remove product alert
   */
  removeAlert(alertId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/alerts/${alertId}`).pipe(
      map(response => {
        const alerts = this.alertsSubject.value;
        this.alertsSubject.next(alerts.filter(a => a.id !== alertId));
        return response;
      }),
      catchError(error => {
        console.error('Error removing alert:', error);
        throw error;
      })
    );
  }

  /**
   * Toggle alert active status
   */
  toggleAlert(alertId: string): Observable<ProductAlert> {
    return this.http.patch<ProductAlert>(`${this.apiUrl}/alerts/${alertId}/toggle`, {}).pipe(
      map(updatedAlert => {
        const alerts = this.alertsSubject.value;
        const updatedAlerts = alerts.map(a => 
          a.id === alertId ? updatedAlert : a
        );
        this.alertsSubject.next(updatedAlerts);
        return updatedAlert;
      }),
      catchError(error => {
        console.error('Error toggling alert:', error);
        throw error;
      })
    );
  }

  /**
   * Check if user has active alert for product
   */
  hasActiveAlert(productId: number, alertType?: string): boolean {
    const alerts = this.alertsSubject.value;
    return alerts.some(alert => 
      alert.productId === productId && 
      alert.isActive && 
      (!alertType || alert.alertType === alertType)
    );
  }

  /**
   * Get alerts for specific product
   */
  getProductAlerts(productId: number): ProductAlert[] {
    return this.alertsSubject.value.filter(alert => alert.productId === productId);
  }

  // === NOTIFICATION SETTINGS ===

  /**
   * Get notification settings
   */
  getNotificationSettings(): Observable<NotificationSettings> {
    return this.http.get<NotificationSettings>(`${this.apiUrl}/settings`).pipe(
      catchError(error => {
        console.error('Error loading notification settings:', error);
        // Return default settings
        return [{
          enableBrowserNotifications: true,
          enableEmailNotifications: true,
          enableStockAlerts: true,
          enablePriceAlerts: true,
          enableReviewAlerts: false,
          alertFrequency: 'immediate'
        }];
      })
    );
  }

  /**
   * Update notification settings
   */
  updateNotificationSettings(settings: NotificationSettings): Observable<NotificationSettings> {
    return this.http.put<NotificationSettings>(`${this.apiUrl}/settings`, settings).pipe(
      catchError(error => {
        console.error('Error updating notification settings:', error);
        throw error;
      })
    );
  }

  // === BROWSER NOTIFICATIONS ===

  /**
   * Request browser notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  /**
   * Show browser notification
   */
  showBrowserNotification(title: string, options: NotificationOptions = {}): void {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/assets/images/qurba-logo.png',
        badge: '/assets/images/qurba-badge.png',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      notification.onclick = () => {
        window.focus();
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
        notification.close();
      };
    }
  }

  /**
   * Show in-app notification
   */
  showLocalNotification(title: string, message: string, type: Notification['type'] = 'info', productId?: number): void {
    const notification: Notification = {
      id: this.generateId(),
      title,
      message,
      type,
      productId,
      isRead: false,
      createdAt: new Date()
    };

    // Add to notifications list
    const notifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...notifications]);
    this.updateUnreadCount([notification, ...notifications]);

    // Emit new notification event
    this.newNotificationSubject.next(notification);
  }

  // === ALERT CHECKING ===

  /**
   * Check active alerts against current product data
   */
  private checkActiveAlerts(): void {
    const alerts = this.alertsSubject.value.filter(alert => alert.isActive);
    
    alerts.forEach(alert => {
      this.checkIndividualAlert(alert);
    });
  }

  /**
   * Check individual alert
   */
  private checkIndividualAlert(alert: ProductAlert): void {
    // This would typically fetch current product data and check conditions
    // For demo purposes, we'll simulate random triggers
    
    const shouldTrigger = Math.random() < 0.01; // 1% chance per check
    
    if (shouldTrigger) {
      this.triggerAlert(alert);
    }
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(alert: ProductAlert): void {
    let title = '';
    let message = '';
    let type: Notification['type'] = 'info';

    switch (alert.alertType) {
      case 'back_in_stock':
        title = '📦 Back in Stock!';
        message = 'A product on your wishlist is now available';
        type = 'success';
        break;
      case 'price':
        title = '💰 Price Drop Alert!';
        message = `Price dropped to RM${alert.targetValue?.toFixed(2)}`;
        type = 'success';
        break;
      case 'stock':
        title = '⚠️ Low Stock Alert';
        message = 'Limited quantities available';
        type = 'warning';
        break;
      case 'new_review':
        title = '⭐ New Review';
        message = 'Someone reviewed a product you\'re watching';
        type = 'info';
        break;
    }

    // Show in-app notification
    this.showLocalNotification(title, message, type, alert.productId);

    // Show browser notification
    this.showBrowserNotification(title, {
      body: message,
      tag: `alert-${alert.id}`,
      data: { 
        url: `/products/${alert.productId}`,
        alertId: alert.id 
      }
    });

    // Mark alert as triggered and deactivate
    this.markAlertTriggered(alert.id!);
  }

  /**
   * Mark alert as triggered
   */
  private markAlertTriggered(alertId: string): void {
    this.http.patch(`${this.apiUrl}/alerts/${alertId}/triggered`, {}).subscribe({
      next: () => {
        const alerts = this.alertsSubject.value;
        const updatedAlerts = alerts.map(a => 
          a.id === alertId ? { ...a, isActive: false, triggeredAt: new Date() } : a
        );
        this.alertsSubject.next(updatedAlerts);
      },
      error: (error) => console.error('Error marking alert as triggered:', error)
    });
  }

  // === UTILITY METHODS ===

  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }

  private checkBrowserNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      // Don't auto-request, wait for user action
      console.log('Browser notifications available but not permitted');
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Get current unread count synchronously
   */
  getCurrentUnreadCount(): number {
    return this.unreadCountSubject.value;
  }

  /**
   * Get current notifications synchronously
   */
  getCurrentNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  /**
   * Test notification (for demo purposes)
   */
  testNotification(): void {
    this.showLocalNotification(
      '🎉 Test Notification',
      'This is a test notification to verify the system is working!',
      'success'
    );
  }
} 