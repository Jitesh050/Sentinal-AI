import pandas as pd
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder, LabelEncoder
import os

NSL_KDD_COLUMNS = [
    'duration','protocol_type','service','flag','src_bytes','dst_bytes','land','wrong_fragment','urgent',
    'hot','num_failed_logins','logged_in','num_compromised','root_shell','su_attempted','num_root',
    'num_file_creations','num_shells','num_access_files','num_outbound_cmds','is_host_login','is_guest_login',
    'count','srv_count','serror_rate','srv_serror_rate','rerror_rate','srv_rerror_rate','same_srv_rate',
    'diff_srv_rate','srv_diff_host_rate','dst_host_count','dst_host_srv_count','dst_host_same_srv_rate',
    'dst_host_diff_srv_rate','dst_host_same_src_port_rate','dst_host_srv_diff_host_rate','dst_host_serror_rate',
    'dst_host_srv_serror_rate','dst_host_rerror_rate','dst_host_srv_rerror_rate','label','difficulty'
]

def preprocess_nsl_kdd(input_path, output_path):
    df = pd.read_csv(input_path, names=NSL_KDD_COLUMNS)
    df.drop('difficulty', axis=1, inplace=True)  # Drop difficulty column
    # Encode categorical features
    for col in ['protocol_type', 'service', 'flag']:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
    # Encode label
    df['label'] = df['label'].apply(lambda x: 0 if x == 'normal' else 1)
    # Optionally scale features
    scaler = MinMaxScaler()
    feature_cols = df.columns.difference(['label'])
    df[feature_cols] = scaler.fit_transform(df[feature_cols])
    df.to_csv(output_path, index=False)
    return df

if __name__ == "__main__":
    raw_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'raw')
    processed_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'processed')
    os.makedirs(processed_dir, exist_ok=True)
    preprocess_nsl_kdd(os.path.join(raw_dir, 'KDDTrain+.txt'), os.path.join(processed_dir, 'train.csv'))
    preprocess_nsl_kdd(os.path.join(raw_dir, 'KDDTest+.txt'), os.path.join(processed_dir, 'test.csv'))
